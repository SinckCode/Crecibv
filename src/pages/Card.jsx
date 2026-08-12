import React from 'react';
import './Carousel.scss';

const Card = ({ card }) => {
  return (
    <div className="card">
      <h3>{card.title}</h3>
      <img src={card.image} alt={card.title} loading="lazy" />
      <p>{card.description}</p>
    </div>
  );
};

export default React.memo(Card);
