import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Carousel.scss';
import Card from './Card';

const Carousel = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600); // Nuevo estado

  useEffect(() => {
    let isMounted = true;

    const fetchCards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cards'));
        if (!isMounted) return;
        const cardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardsData);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
    return () => {
      isMounted = false;
    };
  }, []);

  // Escuchar cambio de tamaño para detectar versión móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (cards.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    if (cards.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    }
  }, [cards.length]);

  return (
    <div className="carousel">
      <div className="title">
        <div className="about1">
          <h1>NUESTROS</h1>
        </div>
        <div className="about2">
          <h1>SERVICIOS</h1>
        </div>
      </div>

      <div className="carousel-container">
        {cards.length > 0 ? (
          isMobile ? (
            // 🌐 Versión MÓVIL
            <>
              <Card card={cards[currentIndex]} />
              <div className="arrow-wrapper">
                <button
                  className="arrow left"
                  onClick={handlePrev}
                  disabled={cards.length <= 1}
                  aria-label="Servicio anterior"
                >
                  ◀
                </button>
                <button
                  className="arrow right"
                  onClick={handleNext}
                  disabled={cards.length <= 1}
                  aria-label="Siguiente servicio"
                >
                  ▶
                </button>
              </div>
            </>
          ) : (
            // 💻 Versión LAPTOP
            <>
              <button className="arrow left" onClick={handlePrev} disabled={cards.length <= 1}>
                ◀
              </button>
              <Card card={cards[currentIndex]} />
              {cards.length > 1 && <Card card={cards[(currentIndex + 1) % cards.length]} />}
              <button className="arrow right" onClick={handleNext} disabled={cards.length <= 1}>
                ▶
              </button>
            </>
          )
        ) : (
          <p className="no-cards">No hay tarjetas disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Carousel;
