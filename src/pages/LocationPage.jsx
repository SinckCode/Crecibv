import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useSiteSettings } from '../hooks/useSiteSettings';
import './LocationPage.scss';

const LocationPage = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { settings } = useSiteSettings();

  return (
    <section ref={ref} className={`location-page ${inView ? 'visible' : ''}`}>
      <div className="title">
        <div className="about1">
          <h1>{settings.sectionTitles.location.line1}</h1>
        </div>
        <div className="about2">
          <h1>{settings.sectionTitles.location.line2}</h1>
        </div>
      </div>
      <div className="location-page__map">
        <iframe
          title="Ubicación CRECIBV"
          src={settings.maps.embedURL}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="location-page__info">
        <h2>Informacion de Contacto</h2>
        <p>
          <strong>Direccion:</strong> {settings.orgInfo.address.full}
        </p>
        <p>
          <strong>Telefono:</strong> {settings.orgInfo.phone}
        </p>
        <p>
          <strong>Horarios:</strong> {settings.orgInfo.hours}
        </p>
      </div>
    </section>
  );
};

export default LocationPage;
