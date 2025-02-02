import React from 'react';
import { useInView } from 'react-intersection-observer';
import './AboutUs.scss';
import img1 from '../assets/imagenesHome/BRAILLE4.jpg';

const AboutUs = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
        <img src={img1} alt="Imagen de la institución" />
      </div>
      <div className="text-Container">

        <div className="firstP">
        <p>
        Nacemos como una opción en atención educativa a personas con discapacidad visual en el estado de Guanajuato en el municipio de León de los Aldama.
        </p>
        </div>

        <p>
        Queremos contribuir por medio de la enseñanza curricular y áreas complementarias, para que personas ciegas o baja visión, tengan mejor calidad de vida y así reducir la brecha de desventajas y de reduzca la desigualdad social. Además de contribuir a una vida plena llena de oportunidades. Contamos con profesionistas capacitados para cada una de las áreas de atención.
        </p>
      </div>
        </div>


    </section>
  );
};

export default AboutUs;
