import React from 'react';
import { useInView } from 'react-intersection-observer';
import './LocationPage.scss';

const LocationPage = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`location-page ${inView ? 'visible' : ''}`}>
      <h1>Nuestra Ubicación</h1>
      <div className="location-page__map">
        <iframe
          title="Ubicación CRECIBV"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4516035364354!2d-122.083839084681!3d37.38605157983037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5e568c5e8b3%3A0x4985bbef504c3d6c!2sGoogleplex!5e0!3m2!1sen!2sus!4v1690110402942!5m2!1sen!2sus"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="location-page__info">
        <h2>Información de Contacto</h2>
        <p><strong>Dirección:</strong> Avenida Principal, Número 123, Ciudad, País.</p>
        <p><strong>Teléfono:</strong> +52 123 456 7890</p>
        <p><strong>Horarios:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</p>
      </div>
    </section>
  );
};

export default LocationPage;
