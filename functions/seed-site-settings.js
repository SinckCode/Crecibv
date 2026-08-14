// Script para poblar content/siteSettings en Firestore con datos reales de CRECIBV
// Uso: node seed-site-settings.js
// Requiere: firebase login (ejecutar antes)

const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_ID = 'crecibv';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

const SITE_SETTINGS = {
  orgInfo: {
    fullName: 'Centro de Recursos Educativos para Ciegos y Baja Vision A.C.',
    shortName: 'CRECIBV, A.C.',
    description: 'Centro de Rehabilitacion y Educacion para Ciegos y Debiles Visuales',
    address: {
      street: 'Calle Alferez 611',
      colony: 'Col. Real Providencia',
      city: 'Leon',
      state: 'Guanajuato',
      country: 'Mexico',
      full: 'Calle Alferez 611, Col. Real Providencia, Leon, Guanajuato, Mexico',
    },
    phone: '+52 477 201 7851',
    email: 'contacto@crecibv.com',
    hours: 'Lunes a Viernes, 9:00 AM - 2:00 PM',
  },
  hero: {
    title: 'BIENVENIDO A CRECIBV',
    ctaText: 'APOYAR',
    ctaLink: '/donaciones',
  },
  donationBanner: {
    text: 'Dona Hoy! Apoya a mejorar la calidad de vida de muchas personas.',
    ctaText: 'APOYAR',
  },
  donations: {
    sectionTitle1: 'HAZ TU',
    sectionTitle2: 'DONATIVO',
    beneficiaryName: 'CRECIBV - Centro de Recursos Educativos para Ciegos y Baja Vision A.C.',
    beneficiaryAddress: 'Alferez No. 611, Colonia Real de Providencia, Leon de los Aldama, Guanajuato, Mexico. C.P. 37234.',
    awarenessMessage: 'Datos para realizar tu donativo',
    callToAction: '',
    bankName: 'BanBajio',
    clabe: '030225900028096394',
    bankLogoURL: '',
    donationImageURL: '',
  },
  socialMedia: [
    { platform: 'facebook', url: 'https://www.facebook.com/CrecibvAC', label: 'Facebook' },
    { platform: 'instagram', url: 'https://www.instagram.com/crecibv/', label: 'Instagram' },
    { platform: 'whatsapp', url: 'https://wa.me/524772017851', label: 'WhatsApp' },
  ],
  maps: {
    embedURL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.315021407141!2d-101.67137812473648!3d21.136858284272185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bcad65409d9a7%3A0x1a8d7d8a6f136eb0!2sAlf%C3%A9rez%20611%2C%20Real%20Providencia%2C%2037234%20Le%C3%B3n%2C%20Gto.%2C%20M%C3%A9xico!5e0!3m2!1sen!2sus!4v1704974979174!5m2!1sen!2sus',
  },
  sectionTitles: {
    aboutUs: { line1: 'ACERCA DE', line2: 'NOSOTROS' },
    services: { line1: 'NUESTROS', line2: 'SERVICIOS' },
    contact: { line1: 'PONTE EN', line2: 'CONTACTO' },
    location: { line1: 'NUESTRA', line2: 'UBICACION' },
    donations: { line1: 'HAZ TU', line2: 'DONATIVO' },
  },
  seo: {
    title: 'CRECIBV - Centro de Recursos Educativos para Ciegos y Baja Vision',
    description: 'Centro de Recursos Educativos para Ciegos y Baja Vision A.C. en Leon, Guanajuato.',
    ogImage: '',
  },
};

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

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) fields[k] = toFirestoreValue(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
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

  console.log('Access token obtenido. Creando documento siteSettings...');

  const fields = {};
  for (const [k, v] of Object.entries(SITE_SETTINGS)) fields[k] = toFirestoreValue(v);

  const res = await request(
    'PATCH',
    'firestore.googleapis.com',
    `/v1/projects/${PROJECT_ID}/databases/(default)/documents/content/siteSettings`,
    { fields },
    { Authorization: `Bearer ${tokenRes.access_token}` },
  );

  if (res.name) {
    console.log('Documento content/siteSettings creado/actualizado exitosamente.');
  } else {
    console.error('Error:', JSON.stringify(res, null, 2));
  }
  
}

main().catch((err) => { console.error('Error:', err); process.exit(1); });
