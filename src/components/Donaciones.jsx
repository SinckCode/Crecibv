import React, { useEffect, useState, useRef } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import './Donaciones.scss';

const Donaciones = () => {
  const [images, setImages] = useState([]);
  const [gridImages, setGridImages] = useState([]);
  const [errors, setErrors] = useState({ nombre: '', email: '', monto: '' });
  const paypalRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'Home/');
        const imageList = await listAll(imagesRef);
        const urls = await Promise.all(imageList.items.map(getDownloadURL));
        setImages(urls);
        setGridImages(generateInitialGrid(urls));
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && gridImages.length > 0) {
      const intervals = gridImages.map((_, index) => {
        const randomTime = Math.random() * 5000 + 3000;
        return setInterval(() => {
          setGridImages((prevGrid) => {
            const used = prevGrid.map((img) => img.url);
            const available = images.filter((url) => !used.includes(url));
            const next = available.length > 0
              ? available[Math.floor(Math.random() * available.length)]
              : images[Math.floor(Math.random() * images.length)];

            return prevGrid.map((img, i) => i === index ? { url: next } : img);
          });
        }, randomTime);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [images, gridImages]);

  const generateInitialGrid = (images) => {
    const gridSize = 12;
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, gridSize).map((url) => ({ url }));
  };

  useEffect(() => {
    if (document.getElementById('paypal-sdk')) return;

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = "https://www.paypal.com/sdk/js?client-id=AXUVRyuWF0CxYCyRIgpZ2ODHFS3-Ahj_WtzKq3QHZ4yzi8REjcbGQ7MvlVywrZ0FD6Of4N8ZkAD9ZK4P&currency=MXN";
    script.async = true;

    script.onload = () => {
      console.log("PayPal SDK cargado ✅");
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const monto = parseFloat(document.getElementById("monto").value);

            const newErrors = { nombre: '', email: '', monto: '' };
            let valid = true;

            if (!nombre || nombre.length < 3) {
              newErrors.nombre = "Ingresa tu nombre completo (mínimo 3 caracteres).";
              valid = false;
            }

            if (!email || !email.includes("@") || !email.includes(".")) {
              newErrors.email = "Ingresa un correo electrónico válido.";
              valid = false;
            }

            if (isNaN(monto) || monto < 10 || monto > 10000) {
              newErrors.monto = "Ingresa un monto entre $10 y $10,000 MXN.";
              valid = false;
            }

            setErrors(newErrors);

            if (!valid) throw new Error("Datos inválidos");

            return actions.order.create({
              purchase_units: [{
                amount: { value: monto.toFixed(2) }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
              document.getElementById("donation-form").reset();
              setErrors({ nombre: '', email: '', monto: '' });
              document.getElementById("modal-gracias").classList.add("show");
            });
          }
        }).render(paypalRef.current);
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="donaciones">
      <div className="image-grid">
        {gridImages.map((image, index) => (
          <div key={index} className="grid-item" style={{ backgroundImage: `url(${image.url})` }}></div>
        ))}
      </div>

      <div className="overlay"></div>

      <div className="form-wrapper">
        <div className="form-card">
          <h1>Apóyanos con tu donativo</h1>
          <p>Tu ayuda hace la diferencia en la vida de personas con discapacidad visual.</p>
          <form id="donation-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" />
            {errors.nombre && <p className="error-msg">{errors.nombre}</p>}

            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="tucorreo@ejemplo.com" />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label htmlFor="monto">Monto (MXN)</label>
            <input type="number" id="monto" name="monto" placeholder="Ej. 200" />
            {errors.monto && <p className="error-msg">{errors.monto}</p>}

            <p className="text-center text-sm text-gray-600 mb-2">
              Haz clic en el botón para realizar tu donación
            </p>
            <div ref={paypalRef} id="paypal-button-container" className="mt-4"></div>
          </form>
        </div>
      </div>

      <div id="modal-gracias" className="modal hidden">
        <div className="modal-content">
          <h2>¡Gracias por tu apoyo! 🫶</h2>
          <p>Tu donación ha sido procesada con éxito. Nos ayudas a seguir transformando vidas.</p>
          <button onClick={() => document.getElementById("modal-gracias").classList.remove("show")}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donaciones;
