import React from 'react';
import { useInView } from 'react-intersection-observer';
import './AboutUs3.scss';

const AboutUs3 = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`page ${inView ? 'visible' : ''}`}>

        <div className="about-us3">

      <div className="text-Container">
        <h2>En el estado de Guanajuato la discapacidad visual es la segunda con más población que presenta está discapacidad con un aproximado de 86,000 personas.</h2>
      </div>
        </div>


    </section>
  );
};

export default AboutUs3;
