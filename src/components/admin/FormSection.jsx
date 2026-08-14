import React from 'react';

const FormSection = ({ label, hint, children, htmlFor }) => (
  <div className="form-section">
    {label && (
      <label className="form-section__label" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {hint && <p className="form-section__hint">{hint}</p>}
    {children}
  </div>
);

export default FormSection;
