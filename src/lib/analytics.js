/**
 * Analitica web con consentimiento previo.
 *
 * El script de Google Analytics NO se carga al abrir el sitio: solo se
 * inyecta cuando la persona acepta en el aviso de cookies. Si rechaza, o
 * si todavia no ha decidido, no se carga nada y no se mide nada.
 *
 * El ID de medicion es el mismo que usa firebase.js, inyectado por el
 * workflow de GitHub Actions como secret.
 */
export const CONSENT_KEY = 'crecibv:consentimiento-analitica';
export const CONSENT_GRANTED = 'granted';
export const CONSENT_DENIED = 'denied';

let scriptInjected = false;

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
 * Envoltura segura sobre gtag(). Si la analitica no esta cargada —porque
 * la persona no dio su consentimiento, o en tests y desarrollo local— la
 * llamada simplemente no hace nada en lugar de reventar.
 */
export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', name, params);
};

/** Solo para tests: reinicia el estado del modulo. */
export const resetAnalyticsForTests = () => {
  scriptInjected = false;
};
