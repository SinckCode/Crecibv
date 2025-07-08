import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './AboutUs.scss';

const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [aboutData, setAboutData] = useState({
    imageURL: "",
    section1: { paragraph1: "", paragraph2: "" },
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("https://us-central1-crecibv.cloudfunctions.net/getAboutUs");
        const data = await response.json();

        if (data.success) {
          setAboutData(data.data);
        } else {
          console.error("Error al cargar la información.");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section ref={ref} className={`page ${inView ? 'visible' : ''}`}>
      <div className="title">
        <div className="about1">
          <h1>ACERCA DE</h1>
        </div>
        <div className="about2">
          <h1>NOSOTROS</h1>
        </div>
      </div>

      <div className="about-us">
        <div className="image-Container">
          <img
            src={aboutData.imageURL || "https://via.placeholder.com/400"}
            alt="Imagen de la institución"
            className="about-image"
          />
        </div>
        <div className="text-Container">
          <div className="firstP">
            <p>{aboutData.section1.paragraph1 || "Cargando información..."}</p>
          </div>
          <p>{aboutData.section1.paragraph2 || "Cargando información..."}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
