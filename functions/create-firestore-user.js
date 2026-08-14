// Script para crear el documento de usuario en Firestore
// Uso: node create-firestore-user.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'crecibv';
const UID = 'Ke1oCFdXZBQYCFa4Eelm8KFkhdd2';
const USER_DATA = {
  name: 'Admin',
  username: 'admin',
  email: 'prueba1@prueba.com',
  photoURL: '',
  uid: UID,
};

const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

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
  // 1. Get access token
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const tokenData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const tokenRes = await request('POST', 'oauth2.googleapis.com', '/token', tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' });

  if (!tokenRes.access_token) {
    console.error('No se pudo obtener access token:', tokenRes);
    process.exit(1);
  }

  // 2. Create Firestore document
  console.log('Creando documento en Firestore...');
  const firestoreDoc = {
    fields: {
      name: { stringValue: USER_DATA.name },
      username: { stringValue: USER_DATA.username },
      email: { stringValue: USER_DATA.email },
      photoURL: { stringValue: USER_DATA.photoURL },
      uid: { stringValue: USER_DATA.uid },
    },
  };

  const res = await request(
    'POST',
    'firestore.googleapis.com',
    `/v1/projects/${PROJECT_ID}/databases/(default)/documents/users`,
    firestoreDoc,
    { Authorization: `Bearer ${tokenRes.access_token}` }
  );

  if (res.name) {
    console.log('Documento creado exitosamente.');
    console.log('Recarga la pagina /admin/ para ver el perfil.');
  } else {
    console.error('Error:', res);
  }
}

main().catch((err) => { console.error('Error:', err); process.exit(1); });
