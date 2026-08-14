import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import banbajioLogoLocal from '../assets/banbajio_logo.png';
import donativoImageLocal from '../assets/donativo_image.jpg';

import './DonativoSection.scss';

const DonativoSection = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { donations } = settings;

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

  const logoURL = donations.bankLogoURL || banbajioLogoLocal;
  const imageURL = donations.donationImageURL || donativoImageLocal;

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonativoSection;
