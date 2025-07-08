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
      <div className="title">
        <div className="about1">
      <h1>NUESTRA</h1>
      </div>
      <div className="about2">
        <h1>UBICACIÓN</h1>
      </div>
        </div>
      <div className="location-page__map">
        <iframe
          title="Ubicación CRECIBV"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.315021407141!2d-101.67137812473648!3d21.136858284272185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bcad65409d9a7%3A0x1a8d7d8a6f136eb0!2sAlf%C3%A9rez%20611%2C%20Real%20Providencia%2C%2037234%20Le%C3%B3n%2C%20Gto.%2C%20M%C3%A9xico!5e0!3m2!1sen!2sus!4v1704974979174!5m2!1sen!2sus"
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
        <p><strong>Teléfono:</strong> +1 52 477 2017851</p>
        <p><strong>Horarios:</strong> Lunes a Viernes, 9:00 AM - 2:00 PM</p>
      </div>
    </section>
  );
};

export default LocationPage;
