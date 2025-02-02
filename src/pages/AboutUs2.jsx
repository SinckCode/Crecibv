import React from 'react';
import { useInView } from 'react-intersection-observer';
import './AboutUs2.scss';
import { FaEye } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa6";



const AboutUs2 = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`page ${inView ? 'visible' : ''}`}>

        <div className="title2">
        <div className="about1">
      <h1>ACERCA DE</h1>
      </div>
      <div className="about2">
        <h1>NOSOTROS</h1>
      </div>
        </div>

        <div className="about-us2">
        <div className="text-Container">

        <h3>VISIÓN</h3>
        <div className="eye">
        <FaEye />
        </div>
        <p>
        Ser la mejor institución en atención a personas con discapacidad visual en el estado de Guanajuato y promover la concientización de la sociedad, para favorecer la cultura de la inclusión social, basada en el respeto y la aceptación a la diversidad.
        </p>

      </div>
      <div className="text-Container">

      <h3>MISIÓN</h3>

      <div className="obje">
      <FaBullseye />
      </div>
        <p>
        Queremos contribuir a qué personas con discapacidad visual, logren incluirse en los diferentes contextos de su vida, social, cultural, laboral y educativo y así tengan igualdad de oportunidades y mejoren su calidad de vida.
        </p>

      </div>
        </div>


    </section>
  );
};

export default AboutUs2;
