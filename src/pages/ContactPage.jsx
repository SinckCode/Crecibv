import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ContactPage.scss';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electronico valido.';
    }

    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres.';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'El mensaje no puede exceder 2000 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      alert('Mensaje enviado con exito. Gracias por contactarnos!');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Ocurrio un error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-pages">
      <div className="title">
        <div className="about1">
          <h1>PONTE EN</h1>
        </div>
        <div className="about2">
          <h1>CONTACTO</h1>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-box">
            <span className="icon">📍</span>
            <h4>Dirección</h4>
            <p>Calle Alférez 611 Colonia Real Providencia León Guanajuato México</p>
          </div>
          <div className="info-box">
            <span className="icon">✉️</span>
            <h4>Email</h4>
            <p>contacto@crecibv.com</p>
          </div>
          <div className="info-box">
            <span className="icon">📞</span>
            <h4>Teléfono</h4>
            <p>+1 52 477 2017851</p>
          </div>
        </div>
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name" className="sr-only">
              Nombre completo
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Tu Nombre Completo"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
            <label htmlFor="contact-email" className="sr-only">
              Correo electronico
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Tu Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
            <label htmlFor="contact-message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Mensaje"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            {errors.message && <p className="field-error">{errors.message}</p>}
            <button className="send-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.315021407141!2d-101.67137812473648!3d21.136858284272185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842bcad65409d9a7%3A0x1a8d7d8a6f136eb0!2sAlf%C3%A9rez%20611%2C%20Real%20Providencia%2C%2037234%20Le%C3%B3n%2C%20Gto.%2C%20M%C3%A9xico!5e0!3m2!1sen!2sus!4v1704974979174!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
