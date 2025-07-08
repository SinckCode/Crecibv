import React from 'react';
import { useInView } from 'react-intersection-observer';
import AboutUs from './AboutUs';
import AboutUs2 from './AboutUs2';
import AboutUs3 from './AboutUs3';
import ContactPage from './ContactPage';
import LocationPage from './LocationPage';
import Carousel from './Carousel';

import './HomePage.scss';

const HomePage = () => {
    const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: aboutRef2, inView: aboutInView2 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: aboutRef3, inView: aboutInView3 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: carouselRef, inView: carouselInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: contactRef, inView: contactInView } = useInView({ triggerOnce: true, threshold: 0 });
  const { ref: locationRef, inView: locationInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="home-page">

      <section id="about-us" ref={aboutRef} className={`section ${aboutInView ? 'visible' : ''}`}>
      <AboutUs />
      </section>

      <section id="about-us2" ref={aboutRef2} className={`section ${aboutInView2 ? 'visible' : ''}`}>
      <AboutUs2 />
      </section>

      <section id="about-us3" ref={aboutRef3} className={`section ${aboutInView3 ? 'visible' : ''}`}>
      <AboutUs3 />
      </section>

      <section id="services" ref={carouselRef} className={`section ${carouselInView ? 'visible' : ''}`}>
        <Carousel />
      </section>

      <section id="contact" ref={contactRef} className={`section ${contactInView ? 'visible' : ''}`}>
        {console.log('ContactPage in view:', contactInView)}
        <ContactPage />
      </section>

      <section id="location" ref={locationRef} className={`section ${locationInView ? 'visible' : ''}`}>
        <LocationPage />
      </section>
    </div>
  );
};

export default HomePage;
