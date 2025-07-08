import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./ContactPage.scss";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "messages"), formData);
      alert("Mensaje enviado con éxito. ¡Gracias por contactarnos!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Ocurrió un error al enviar el mensaje. Intenta nuevamente.");
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
          <input
            type="text"
            name="name"
            placeholder="Tu Nombre Completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Tu Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Mensaje"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button className="send-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
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
