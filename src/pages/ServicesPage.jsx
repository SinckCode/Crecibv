import React from 'react';
import { useInView } from 'react-intersection-observer';
import './ServicesPage.scss';

const services = [
  { id: 1, title: 'Terapia Visual', description: 'Mejoramos la percepción visual con ejercicios especializados.', image: '/assets/therapy.jpg' },
  { id: 2, title: 'Apoyo Escolar', description: 'Clases y recursos educativos adaptados.', image: '/assets/school.jpg' },
  { id: 3, title: 'Orientación y Movilidad', description: 'Entrenamiento para desplazamiento seguro.', image: '/assets/mobility.jpg' },
];

const ServicesPage = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`services-page ${inView ? 'visible' : ''}`}>
      <h1>Nuestros Servicios</h1>
      <div className="services-list">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <img src={service.image} alt={service.title} />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;
