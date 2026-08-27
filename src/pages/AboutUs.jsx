import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useSiteSettings } from '../hooks/useSiteSettings';
import './AboutUs.scss';

const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { settings } = useSiteSettings();

  const [aboutData, setAboutData] = useState({
    imageURL: '',
    section1: { paragraph1: '', paragraph2: '' },
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'content', 'aboutUs');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
        } else {
          console.error('No se encontro la informacion.');
        }
      } catch (error) {
        console.error('Error de conexion:', error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section ref={ref} className={`page ${inView ? 'visible' : ''}`}>
      <div className="title">
        <div className="about1">
          <h1>{settings.sectionTitles.aboutUs.line1}</h1>
        </div>
        <div className="about2">
          <h1>{settings.sectionTitles.aboutUs.line2}</h1>
        </div>
      </div>

      <div className="about-us">
        <div className="image-Container">
          <img
            src={aboutData.imageURL || 'https://via.placeholder.com/400'}
            alt="Imagen de la institución"
            className="about-image"
            loading="lazy"
          />
        </div>
        <div className="text-Container">
          <div className="firstP">
            <p>{aboutData.section1.paragraph1 || 'Cargando información...'}</p>
          </div>
          <p>{aboutData.section1.paragraph2 || 'Cargando información...'}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
