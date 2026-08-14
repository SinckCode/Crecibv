import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import './Home.scss';

const GRID_SIZE = 9;

const Home = () => {
  const [images, setImages] = useState([]);
  const [grid, setGrid] = useState([]);
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const imagesRef = useRef([]);
  const gridRef = useRef([]);

  // Keep refs in sync for use inside intervals
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Fetch images from Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'Home/');
        const imageList = await listAll(storageRef);
        const urls = await Promise.all(imageList.items.map((item) => getDownloadURL(item)));
        if (urls.length === 0) return;

        setImages(urls);

        // Build initial grid with no adjacent duplicates
        const initialGrid = [];
        const shuffled = [...urls].sort(() => Math.random() - 0.5);
        for (let i = 0; i < GRID_SIZE; i++) {
          initialGrid.push({
            current: shuffled[i % shuffled.length],
            next: null,
            fading: false,
          });
        }
        setGrid(initialGrid);
      } catch (error) {
        console.error('Error al cargar imagenes:', error);
      }
    };

    fetchImages();
  }, []);

  // Pick a random image not currently shown in the grid
  const pickNewImage = useCallback((excludeUrls) => {
    const all = imagesRef.current;
    if (all.length <= 1) return all[0] || '';
    const available = all.filter((url) => !excludeUrls.includes(url));
    if (available.length === 0) {
      return all[Math.floor(Math.random() * all.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  }, []);

  // Start rotation intervals — one per cell, staggered
  useEffect(() => {
    if (images.length < 2 || grid.length === 0) return;

    const intervals = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      // Stagger start: each cell starts after a random delay
      const initialDelay = Math.random() * 4000 + 1000;

      const timeoutId = setTimeout(() => {
        const rotate = () => {
          const currentGrid = gridRef.current;
          const usedUrls = currentGrid.map((cell) => cell.current);
          const newUrl = pickNewImage(usedUrls);

          // Set 'next' image and start fade
          setGrid((prev) =>
            prev.map((cell, idx) => (idx === i ? { ...cell, next: newUrl, fading: true } : cell)),
          );

          // After fade completes, swap current and clear next
          setTimeout(() => {
            setGrid((prev) =>
              prev.map((cell, idx) =>
                idx === i
                  ? { current: cell.next || cell.current, next: null, fading: false }
                  : cell,
              ),
            );
          }, 1000); // Match CSS transition duration
        };

        rotate();
        const intervalId = setInterval(rotate, Math.random() * 4000 + 4000);
        intervals.push(intervalId);
      }, initialDelay);

      intervals.push(timeoutId);
    }

    return () => intervals.forEach((id) => clearInterval(id));
    // Only run once when images are loaded and grid is initialized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length > 0 && grid.length > 0]);

  return (
    <div className="home">
      <div className="image-grid">
        {grid.map((cell, index) => (
          <div key={index} className="grid-item">
            <div className="grid-img" style={{ backgroundImage: `url(${cell.current})` }} />
            {cell.next && (
              <div
                className={`grid-img grid-img--next ${cell.fading ? 'grid-img--visible' : ''}`}
                style={{ backgroundImage: `url(${cell.next})` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="overlay-content">
        <div className="background-overlay"></div>
        <h1>{settings.hero.title}</h1>
        <button className="cta-button" onClick={() => navigate(settings.hero.ctaLink)}>
          {settings.hero.ctaText}
        </button>
      </div>
    </div>
  );
};

export default Home;
