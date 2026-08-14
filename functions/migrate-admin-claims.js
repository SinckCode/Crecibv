// Script para migrar claims de admin: true -> role: "admin"
// Uso: node migrate-admin-claims.js
// Requiere: firebase login (ejecutar antes)

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'crecibv';
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
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.config', 'configstore', 'firebase-tools.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const tokenData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const tokenRes = await request('POST', 'oauth2.googleapis.com', '/token', tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' });

  if (!tokenRes.access_token) {
    console.error('No se pudo obtener access token:', tokenRes);
    process.exit(1);
  }

  console.log('Access token obtenido. Listando usuarios...');

  // List all users
  const listRes = await request(
    'POST',
    'identitytoolkit.googleapis.com',
    `/v1/projects/${PROJECT_ID}/accounts:batchGet`,
    { maxResults: 100 },
    { Authorization: `Bearer ${tokenRes.access_token}` },
  );

  const users = listRes.users || [];
  console.log(`Encontrados ${users.length} usuarios.`);

  let migrated = 0;
  for (const user of users) {
    let claims = {};
    try {
      claims = JSON.parse(user.customAttributes || '{}');
    } catch { /* ignore */ }

    if (claims.admin === true && !claims.role) {
      console.log(`Migrando ${user.localId} (${user.email})...`);
      await request(
        'POST',
        'identitytoolkit.googleapis.com',
        `/v1/projects/${PROJECT_ID}/accounts:update`,
        { localId: user.localId, customAttributes: JSON.stringify({ role: 'admin' }) },
        { Authorization: `Bearer ${tokenRes.access_token}` },
      );
      migrated++;
    } else if (claims.role) {
      console.log(`  ${user.localId} ya tiene role="${claims.role}", saltando.`);
    }
  }

  console.log(`\nMigracion completada. ${migrated} usuarios actualizados.`);
}

main().catch((err) => { console.error('Error:', err); process.exit(1); });
