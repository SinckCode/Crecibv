import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './Carousel.scss';
import Card from './Card';

const Carousel = () => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
    };

    fetchCards();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'cards', id));
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div className="carousel-container">
      <button className="arrow left" onClick={handlePrev}>◀</button>
      {cards.length > 0 && (
        <Card card={cards[currentIndex]} />
    )}
    {cards.length > 0 && (
        <Card card={cards[(currentIndex + 1) % cards.length]} />
    )}

      <button className="arrow right" onClick={handleNext}>▶</button>
    </div>
  );
};

export default Carousel;
