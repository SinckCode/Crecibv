import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import './AboutUs2.scss';
import { FaEye } from "react-icons/fa";
import { FaBullseye } from "react-icons/fa6";

const AboutUs2 = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [aboutData, setAboutData] = useState({ mission: "", vision: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "content", "aboutUs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data().section2);
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


      <div className="about-us2">
        <div className="text-Container">
          <h3>VISIÓN</h3>
          <div className="eye"><FaEye /></div>
          <p>{aboutData.vision || "Cargando información..."}</p>
        </div>
        <div className="text-Container">
          <h3>MISIÓN</h3>
          <div className="obje"><FaBullseye /></div>
          <p>{aboutData.mission || "Cargando información..."}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs2;
