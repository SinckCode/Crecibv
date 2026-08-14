// Script para poblar la coleccion 'cards' con los servicios reales de CRECIBV
// Uso: node seed-cards.js
// Requiere: firebase login (ejecutar antes)

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'crecibv';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const SERVICES = [
  {
    title: 'Sistema Braille',
    description: 'Sistema de lectura y escritura tactil que le permite a la persona ciega o con baja vision acceder a los aprendizajes.',
    image: '',
  },
  {
    title: 'Orientacion y Movilidad',
    description: 'Desarrollo de habilidades de desplazamiento seguro, eficiente y efectivo mediante tecnicas sensoriales y resolucion de problemas para personas con discapacidad visual.',
    image: '',
  },
  {
    title: 'Vida Diaria',
    description: 'Programa enfocado en destrezas para tareas cotidianas de cuidado personal, cuidado del hogar, actividades sociales y de comunicacion de manera independiente.',
    image: '',
  },
  {
    title: 'Actividades Curriculares',
    description: 'Oferta educativa en niveles preescolar, primaria y secundaria orientada a la socializacion e inclusion en diferentes contextos.',
    image: '',
  },
  {
    title: 'Activacion Fisica',
    description: 'Desarrollo de competencia fisica, conocimiento de movimiento y orientacion en el espacio, promoviendo estilos de vida activos y saludables.',
    image: '',
  },
  {
    title: 'Tiflotecnologia',
    description: 'Conjunto de teorias, conocimientos, recursos y tecnicas que aplica tecnologia adaptada para personas con discapacidad visual, favoreciendo su autonomia e integracion.',
    image: '',
  },
];

function request(method, hostname, urlPath, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const opts = {
      hostname, path: urlPath, method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers },
    };
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', (d) => (chunks += d));
      res.on('end', () => { try { resolve(JSON.parse(chunks)); } catch { resolve(chunks); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const tokenData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const tokenRes = await request('POST', 'oauth2.googleapis.com', '/token', tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' });

  if (!tokenRes.access_token) {
    console.error('No se pudo obtener access token:', tokenRes);
    process.exit(1);
  }

  console.log('Access token obtenido. Creando documentos en coleccion cards...');

  let created = 0;
  for (const service of SERVICES) {
    const fields = {
      title: { stringValue: service.title },
      description: { stringValue: service.description },
      image: { stringValue: service.image },
    };

    const res = await request(
      'POST',
      'firestore.googleapis.com',
      `/v1/projects/${PROJECT_ID}/databases/(default)/documents/cards`,
      { fields },
      { Authorization: `Bearer ${tokenRes.access_token}` },
    );

    if (res.name) {
      created++;
      console.log(`  Creado: ${service.title}`);
    } else {
      console.error(`  Error creando ${service.title}:`, JSON.stringify(res, null, 2));
    }
  }

  console.log(`\n${created}/${SERVICES.length} servicios creados exitosamente.`);
}

main().catch((err) => { console.error('Error:', err); process.exit(1); });
