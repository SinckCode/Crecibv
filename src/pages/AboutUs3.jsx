import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import './AboutUs3.scss';

const AboutUs3 = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [aboutData, setAboutData] = useState({ info: "", title: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "content", "aboutUs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data().section3);
        } else {
          console.error("No se encontró la información.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section ref={ref} className={`page ${inView ? 'visible' : ''}`}>
      <div className="about-us3">
        <div className="text-Container">
          <h2>{aboutData.info || "Cargando información..."}</h2>
        </div>
      </div>
    </section>
  );
};

export default AboutUs3;
