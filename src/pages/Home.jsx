import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import './Home.scss';

const Home = () => {
  const [images, setImages] = useState([]);
  const [gridImages, setGridImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, 'Home/');
        const imageList = await listAll(imagesRef);
        const urls = await Promise.all(
          imageList.items.map((item) => getDownloadURL(item))
        );

        setImages(urls);
        setGridImages(generateInitialGrid(urls)); // Inicializamos el grid con imágenes únicas
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && gridImages.length > 0) {
      const intervals = gridImages.map((_, index) => {
        const randomTime = Math.random() * 5000 + 3000; // Intervalo aleatorio entre 3 y 8 segundos
        return setInterval(() => {
          setGridImages((prevGrid) => {
            const usedImages = prevGrid.map((img) => img.url);
            const availableImages = images.filter((url) => !usedImages.includes(url));

            const nextImage =
              availableImages.length > 0
                ? availableImages[Math.floor(Math.random() * availableImages.length)]
                : images[Math.floor(Math.random() * images.length)];

            return prevGrid.map((img, idx) =>
              idx === index ? { url: nextImage } : img
            );
          });
        }, randomTime);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [images, gridImages]);

  const generateInitialGrid = (images) => {
    const gridSize = 12; // Tamaño del grid 4x3
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);
    return shuffledImages.slice(0, gridSize).map((url) => ({ url }));
  };

  return (
    <div className="home">
      <div className="image-grid">
        {gridImages.map((image, index) => (
          <div
            key={index}
            className="grid-item"
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          ></div>
        ))}
      </div>
      <div className="overlay-content">
        <div className="background-overlay"></div>
        <h1>BIENVENIDO A CRECIBV</h1>
        <button className="cta-button">APOYAR</button>
      </div>
    </div>
  );
};

export default Home;
