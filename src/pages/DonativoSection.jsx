import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { trackEvent } from '../lib/analytics';
import banbajioLogoLocal from '../assets/banbajio_logo.png';
import donativoImageLocal from '../assets/donativo_image.jpg';

import './DonativoSection.scss';

const pesos = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
});

const DonativoSection = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { donations } = settings;
  const [copied, setCopied] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (location.hash === '#donativos') {
      const element = document.getElementById('donativos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // El aviso de copiado se limpia solo para no dejarlo pegado en pantalla
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, [copied]);

  const logoURL = donations.bankLogoURL || banbajioLogoLocal;
  const imageURL = donations.donationImageURL || donativoImageLocal;
  const suggestedAmounts = (donations.suggestedAmounts || []).filter((item) => item && item.amount);

  const whatsappLink = donations.whatsappNumber
    ? `https://wa.me/${donations.whatsappNumber}?text=${encodeURIComponent(
        donations.whatsappMessage || '',
      )}`
    : '';

  const handleDonateClick = () => {
    trackEvent('click_donar_gofundme', { value: 1 });
  };

  const handleWhatsappClick = () => {
    trackEvent('click_whatsapp_donativo', { value: 1 });
  };

  const handleCopyClabe = async () => {
    trackEvent('copiar_clabe', { value: 1 });
    try {
      await navigator.clipboard.writeText(donations.clabe);
      setCopied(true);
    } catch (err) {
      console.error('No se pudo copiar la CLABE:', err);
    }
  };

  return (
    <section id="donativos" ref={ref} className={`page ${inView ? 'visible' : ''}`}>
      <div className="title">
        <div className="title1">
          <h1>{donations.sectionTitle1}</h1>
        </div>
        <div className="title1">
          <h1>{donations.sectionTitle2}</h1>
        </div>
      </div>

      {donations.highlightNotice && <p className="highlight-notice">{donations.highlightNotice}</p>}

      <div className="donations-container">
        <div className="image-Container">
          <img
            src={imageURL}
            alt="Ilustracion sobre discapacidad visual"
            className="donations-image animated-pulse"
            loading="lazy"
          />
        </div>

        <div className="text-Container">
          {donations.primaryCtaURL && (
            <div className="donate-actions">
              <a
                className="donate-actions__primary"
                href={donations.primaryCtaURL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDonateClick}
              >
                {donations.primaryCtaText || 'Donar ahora'}
              </a>

              {whatsappLink && (
                <a
                  className="donate-actions__whatsapp"
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsappClick}
                >
                  Donar por WhatsApp
                </a>
              )}
            </div>
          )}

          {suggestedAmounts.length > 0 && (
            <div className="suggested-amounts">
              <span className="suggested-amounts__label">Tu donativo en obra concreta</span>
              <ul className="suggested-amounts__list">
                {suggestedAmounts.map((item) => (
                  <li key={item.amount} className="suggested-amounts__item">
                    <span className="suggested-amounts__figure">{pesos.format(item.amount)}</span>
                    <span className="suggested-amounts__impact">{item.impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="firstP">
            <p>{donations.awarenessMessage}</p>
          </div>
          {donations.callToAction && (
            <div className="secondP">
              <p>{donations.callToAction}</p>
            </div>
          )}

          <div className="bank-details">
            <div className="bank-details__beneficiary">
              <span className="bank-details__label">Beneficiario:</span>
              <span>{donations.beneficiaryName}</span>
            </div>
            {donations.beneficiaryAddress && (
              <div className="bank-details__address">
                <span className="bank-details__label">Direccion:</span>
                <span>{donations.beneficiaryAddress}</span>
              </div>
            )}

            <span className="bank-label">BANCO: {donations.bankName}</span>
            <span className="clabe-label">CLABE INTERBANCARIA:</span>

            <div className="clabe-wrapper">
              <div className="clabe-box">
                <code>{donations.clabe}</code>
              </div>
              <img
                src={logoURL}
                alt={`Logo ${donations.bankName}`}
                className="banbajio-logo-inline"
                loading="lazy"
              />
            </div>

            <button type="button" className="clabe-copy" onClick={handleCopyClabe}>
              Copiar CLABE
            </button>
            <span className="clabe-copy__status" role="status" aria-live="polite">
              {copied ? 'CLABE copiada al portapapeles' : ''}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonativoSection;
