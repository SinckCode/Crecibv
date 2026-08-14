// Script temporal para asignar admin claim - borrar despues de usar
const fs = require('fs');
const path = require('path');
const https = require('https');

const UID = 'Ke1oCFdXZBQYCFa4Eelm8KFkhdd2';
const PROJECT_ID = 'crecibv';

// Leer refresh token del Firebase CLI
const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const refreshToken = config.tokens.refresh_token;

// Firebase CLI public OAuth credentials
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

function postJSON(hostname, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    const opts = {
      hostname, path, method: 'POST',
      headers: { 'Content-Type': headers['Content-Type'] || 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers }
    };
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', (d) => chunks += d);
      res.on('end', () => {
        try { resolve(JSON.parse(chunks)); } catch { resolve(chunks); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // 1. Get access token from refresh token
  const tokenData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const tokenRes = await postJSON('oauth2.googleapis.com', '/token', tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' });

  if (!tokenRes.access_token) {
    console.error('No se pudo obtener access token:', tokenRes);
    process.exit(1);
  }

  console.log('Access token obtenido.');

  // 2. Set custom claims via Identity Toolkit Admin API
  const setClaimsRes = await postJSON(
    'identitytoolkit.googleapis.com',
    `/v1/projects/${PROJECT_ID}/accounts:update`,
    { localId: UID, customAttributes: JSON.stringify({ admin: true }) },
    { Authorization: `Bearer ${tokenRes.access_token}` }
  );

  if (setClaimsRes.localId === UID) {
    console.log('Admin claim asignado exitosamente al UID:', UID);
    console.log('Ahora cierra sesion en la app y vuelve a iniciar sesion.');
  } else {
    console.error('Error al asignar claim:', setClaimsRes);
  }
}

main().catch((err) => { console.error('Error:', err); process.exit(1); });
