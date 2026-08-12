import React from 'react';
import './ServiceCard.scss';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <img src={service.image} alt={service.title} loading="lazy" />
      <h2>{service.title}</h2>
      <p>{service.description}</p>
    </div>
  );
};

export default React.memo(ServiceCard);
