import React from 'react';

const StatCard = ({ icon, label, value, onClick }) => (
  <div
    className="stat-card"
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <span className="stat-card__icon">{icon}</span>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </div>
);

export default StatCard;
