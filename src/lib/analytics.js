/**
 * Envoltura segura sobre gtag().
 * Si Google Analytics no esta cargado (desarrollo local, tests, bloqueadores
 * de anuncios) la llamada simplemente no hace nada en lugar de reventar.
 */
export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', name, params);
};
