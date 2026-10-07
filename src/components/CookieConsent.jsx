import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  loadAnalytics,
  readConsent,
  saveConsent,
} from '../lib/analytics';

import './CookieConsent.scss';

/**
 * Aviso de cookies.
 *
 * Decisiones de diseno:
 * - No bloquea la pagina. Es una franja al pie, no un modal: un modal sobre
 *   la seccion de donativos cuesta donaciones.
 * - No roba el foco. Se anuncia con aria-live para que quien usa lector de
 *   pantalla sepa que esta ahi y pueda llegar con el teclado, sin que se le
 *   interrumpa la lectura de la pagina.
 * - Rechazar tiene efecto real: si no se acepta, gtag.js nunca se inyecta.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readConsent();

    if (stored === CONSENT_GRANTED) {
      loadAnalytics();
      return;
    }

    if (stored === CONSENT_DENIED) {
      return;
    }

    setVisible(true);
  }, []);

  const handleAccept = () => {
    saveConsent(CONSENT_GRANTED);
    loadAnalytics();
    setVisible(false);
  };

  const handleReject = () => {
    saveConsent(CONSENT_DENIED);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Aviso de cookies" aria-live="polite">
      <div className="cookie-consent__inner">
        <p className="cookie-consent__text">
          Usamos cookies para entender como se usa el sitio y mejorarlo. No recopilamos datos que lo
          identifiquen por nombre. Puede consultar el detalle en nuestro{' '}
          <Link to="/aviso-de-privacidad">Aviso de Privacidad</Link>.
        </p>
        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__reject" onClick={handleReject}>
            Rechazar
          </button>
          <button type="button" className="cookie-consent__accept" onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </section>
  );
};

export default CookieConsent;
