/**
 * Medicion web con consentimiento previo.
 *
 * Ningun script de medicion se carga al abrir el sitio: se inyectan solo
 * cuando la persona acepta en el aviso de cookies. Si rechaza, o si todavia
 * no ha decidido, no se carga nada y no se mide nada. Esto vale tanto para
 * Google Analytics como para el pixel de Meta.
 *
 * Por eso ninguno de los dos va como <script> en public/index.html: ahi
 * cargaria antes de que hubiera consentimiento y el aviso de cookies
 * dejaria de servir para algo.
 *
 * Los IDs los inyecta el workflow de GitHub Actions como secrets al
 * compilar, asi que nunca entran al repositorio. Si un ID no esta
 * configurado, su medidor simplemente no se carga y el resto sigue
 * funcionando.
 */
export const CONSENT_KEY = 'crecibv:consentimiento-analitica';
export const CONSENT_GRANTED = 'granted';
export const CONSENT_DENIED = 'denied';

let scriptInjected = false;
let pixelInjected = false;

/** Lee la decision guardada. Devuelve null si aun no ha decidido. */
export const readConsent = () => {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch (err) {
    // Modo privado o almacenamiento bloqueado: se trata como sin decidir
    return null;
  }
};

/** Guarda la decision para no volver a preguntar en cada visita. */
export const saveConsent = (value) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch (err) {
    // Si no se puede guardar, el banner volvera a aparecer. Es preferible
    // a asumir un consentimiento que no podemos acreditar.
  }
};

/**
 * Inyecta gtag.js. Idempotente: llamarlo dos veces no duplica el script.
 * No hace nada si no hay un ID de medicion valido configurado.
 */
export const loadAnalytics = () => {
  if (scriptInjected) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const gaId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
  if (!gaId || gaId.indexOf('G-') !== 0) return;

  scriptInjected = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
};

/**
 * Inyecta el pixel de Meta. Idempotente, igual que loadAnalytics.
 * No hace nada si no hay un ID configurado.
 *
 * La instalacion estandar de Meta incluye ademas un <noscript> con una
 * imagen de respaldo. Aqui se omite a proposito: esa imagen se cargaria
 * sin pasar por el consentimiento, que es justo lo que este modulo evita.
 */
export const loadMetaPixel = () => {
  if (pixelInjected) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Un ID de pixel es una cadena de digitos. Validarlo evita inicializar el
  // pixel con el marcador de posicion de .env.example si alguien lo copia
  // sin rellenarlo, igual que loadAnalytics exige el prefijo G- de Google.
  const pixelId = process.env.REACT_APP_META_PIXEL_ID;
  if (!pixelId || !/^\d+$/.test(pixelId)) return;

  pixelInjected = true;

  // Cola de llamadas de fbq. Guarda lo que se dispare antes de que el
  // script termine de cargar, para no perder el primer PageView.
  const fbq = function fbq(...args) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  window.fbq = window.fbq || fbq;
  window._fbq = window._fbq || window.fbq;

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
};

/** Carga los medidores que tengan ID configurado. Se llama al aceptar. */
export const loadTrackers = () => {
  loadAnalytics();
  loadMetaPixel();
};

/**
 * Equivalencia de nuestros eventos con los eventos estandar de Meta. Usar
 * los estandar —y no eventos propios— es lo que permite optimizar las
 * campanas hacia la conversion en el administrador de anuncios.
 */
const META_STANDARD_EVENTS = {
  click_donar_gofundme: 'Donate',
  click_whatsapp_donativo: 'Contact',
  copiar_clabe: 'Donate',
};

/**
 * Registra un evento en los medidores que esten cargados. Si alguno no lo
 * esta —porque la persona no dio su consentimiento, o en tests y desarrollo
 * local— esa parte simplemente no hace nada en lugar de reventar.
 */
export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  if (typeof window.fbq === 'function') {
    const standard = META_STANDARD_EVENTS[name];
    if (standard) {
      window.fbq('track', standard);
    } else {
      window.fbq('trackCustom', name, params);
    }
  }
};

/** Solo para tests: reinicia el estado del modulo. */
export const resetAnalyticsForTests = () => {
  scriptInjected = false;
  pixelInjected = false;
};
