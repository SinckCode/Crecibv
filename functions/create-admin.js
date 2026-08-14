// Script para crear un usuario admin en Firebase Auth
// Uso: node create-admin.js <email> <password>
// Ejemplo: node create-admin.js admin@crecibv.com MiPassword123

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyDRX_8Y6Uf-BAS3U9hShUeYhvw0LbQMlrc';
const PROJECT_ID = 'crecibv';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Uso: node create-admin.js <email> <password>');
  console.error('Ejemplo: node create-admin.js admin@crecibv.com MiPassword123');
  process.exit(1);
}

if (password.length < 6) {
  console.error('La contraseña debe tener al menos 6 caracteres.');
  process.exit(1);
}

// Firebase CLI public OAuth credentials
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

function postJSON(hostname, urlPath, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const opts = {
      hostname,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': headers['Content-Type'] || 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...headers,
      },
    };
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', (d) => (chunks += d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(chunks));
        } catch {
          resolve(chunks);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Paso 1: Crear usuario via Firebase Auth REST API
  console.log(`\n1. Creando usuario: ${email}...`);
  const signUpRes = await postJSON(
    'identitytoolkit.googleapis.com',
    `/v1/accounts:signUp?key=${API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  if (signUpRes.error) {
    if (signUpRes.error.message === 'EMAIL_EXISTS') {
      console.error('Este email ya existe en Firebase Auth.');
      console.error('Si quieres asignarle admin claim, usa set-admin.js con su UID.');
    } else {
      console.error('Error al crear usuario:', signUpRes.error.message);
    }
    process.exit(1);
  }

  const uid = signUpRes.localId;
  console.log(`   Usuario creado. UID: ${uid}`);

  // Paso 2: Obtener access token desde Firebase CLI
  console.log('\n2. Obteniendo access token...');
  const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE,
    '.config',
    'configstore',
    'firebase-tools.json'
  );

  let refreshToken;
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    refreshToken = config.tokens.refresh_token;
  } catch {
    console.error('No se encontro el token de Firebase CLI.');
    console.error('Ejecuta "firebase login" primero.');
    console.error(`\nEl usuario fue creado (UID: ${uid}) pero SIN admin claim.`);
    console.error('Despues de hacer firebase login, ejecuta:');
    console.error(`  node set-admin.js  (cambia el UID en el archivo a: ${uid})`);
    process.exit(1);
  }

  const tokenData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const tokenRes = await postJSON('oauth2.googleapis.com', '/token', tokenData, {
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  if (!tokenRes.access_token) {
    console.error('No se pudo obtener access token:', tokenRes);
    console.error(`\nEl usuario fue creado (UID: ${uid}) pero SIN admin claim.`);
    process.exit(1);
  }

  console.log('   Access token obtenido.');

  // Paso 3: Asignar admin claim
  console.log('\n3. Asignando admin claim...');
  const setClaimsRes = await postJSON(
    'identitytoolkit.googleapis.com',
    `/v1/projects/${PROJECT_ID}/accounts:update`,
    { localId: uid, customAttributes: JSON.stringify({ admin: true }) },
    { Authorization: `Bearer ${tokenRes.access_token}` }
  );

  if (setClaimsRes.localId === uid) {
    console.log('   Admin claim asignado.');
    console.log('\n========================================');
    console.log('  USUARIO ADMIN CREADO EXITOSAMENTE');
    console.log('========================================');
    console.log(`  Email: ${email}`);
    console.log(`  UID:   ${uid}`);
    console.log(`  Admin: true`);
    console.log('========================================');
    console.log('\nYa puedes iniciar sesion en /login');
  } else {
    console.error('Error al asignar admin claim:', setClaimsRes);
    console.error(`\nEl usuario fue creado (UID: ${uid}) pero SIN admin claim.`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
