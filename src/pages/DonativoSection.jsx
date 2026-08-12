import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import banbajioLogoLocal from '../assets/banbajio_logo.png';
import donativoImageLocal from '../assets/donativo_image.jpg';

import './DonativoSection.scss';

const DonativoSection = () => {
  const location = useLocation();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const donationData = {
    logoURL: banbajioLogoLocal,
    animatedImageURL: donativoImageLocal,
    awarenessMessage:
      'Ver con el corazon trasciende la vista. Tu apoyo abre caminos, elimina barreras e impulsa la autonomia e inclusion de personas con discapacidad visual.',
    callToAction:
      '¡Tu aportacion transforma vidas! Cada donativo nos permite continuar brindando herramientas de movilidad y programas de integracion.',
    bankInfo: {
      bankName: 'BanBajio',
      clabe: '030225900028096394',
    },
  };

  useEffect(() => {
    if (location.hash === '#donativos') {
      const element = document.getElementById('donativos');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <section id="donativos" ref={ref} className={`page ${inView ? 'visible' : ''}`}>
      <div className="title">
        <div className="title1">
          <h1>HAZ TU</h1>
        </div>
        <div className="title1">
          <h1>DONATIVO</h1>
        </div>
      </div>

      <div className="donations-container">
        <div className="image-Container">
          <img
            src={donationData.animatedImageURL}
            alt="Ilustración animada sobre discapacidad visual"
            className="donations-image animated-pulse"
            loading="lazy"
          />
        </div>

        <div className="text-Container">
          <div className="firstP">
            <p>{donationData.awarenessMessage}</p>
          </div>
          <div className="secondP">
            <p>{donationData.callToAction}</p>
          </div>

          <div className="bank-details">
            <span className="bank-label">BANCO: {donationData.bankInfo.bankName}</span>
            <span className="clabe-label">CLABE INTERBANCARIA:</span>

            <div className="clabe-wrapper">
              <div className="clabe-box">
                <code>{donationData.bankInfo.clabe}</code>
              </div>
              <img
                src={donationData.logoURL}
                alt="Logo BanBajío"
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
