import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';
import banbajioLogoLocal from '../assets/banbajio_logo.png';
import donativoImageLocal from '../assets/donativo_image.jpg';

import './DonativoSection.scss';

const DonativoSection = () => {
    const location = useLocation();

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [donationData, setDonationData] = useState({
        logoURL: banbajioLogoLocal,
        animatedImageURL: donativoImageLocal,
        awarenessMessage: "Ver con el corazón trasciende la vista. Tu apoyo abre caminos, elimina barreras e impulsa la autonomía e inclusión de personas con discapacidad visual.",
        callToAction: "¡Tu aportación transforma vidas! Cada donativo nos permite continuar brindando herramientas de movilidad y programas de integración.",
        bankInfo: {
            bankName: "BanBajío",
            clabe: "030225900028096394"
        }
    });

    useEffect(() => {
        if (location.hash === '#donativos') {
            const element = document.getElementById('donativos');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    useEffect(() => {
        const fetchDonationData = async () => {
            try {
                const response = await fetch("https://us-central1-crecibv.cloudfunctions.net/getDonations");
                const data = await response.json();

                if (data.success && data.data) {
                    setDonationData({
                        ...data.data,
                        logoURL: data.data.logoURL || banbajioLogoLocal,
                        animatedImageURL: data.data.animatedImageURL || donativoImageLocal
                    });
                }
            } catch (error) {
                console.error("Error de conexión:", error);
            }
        };

        fetchDonationData();
    }, []);

    return (
        <section id="donativos" ref={ref} className={`page ${inView ? 'visible' : ''}`}>
            <div className="title">
                <div className="title1">
                    <h1>HAZ TU</h1>
                </div>
                <div className="title1">
                    <h1>DONATIVO</h1>
                </div>
            </div>

            <div className="donations-container">
                <div className="image-Container">
                    <img
                        src={donationData.animatedImageURL}
                        alt="Ilustración animada sobre discapacidad visual"
                        className="donations-image animated-pulse"
                    />
                </div>

                <div className="text-Container">
                    <div className="firstP">
                        <p>{donationData.awarenessMessage}</p>
                    </div>
                    <div className="secondP">
                        <p>{donationData.callToAction}</p>
                    </div>

                    <div className="bank-details">
                        <span className="bank-label">BANCO: {donationData.bankInfo.bankName}</span>
                        <span className="clabe-label">CLABE INTERBANCARIA:</span>

                        <div className="clabe-wrapper">
                            <div className="clabe-box">
                                <code>{donationData.bankInfo.clabe}</code>
                            </div>
                            <img
                                src={donationData.logoURL}
                                alt="Logo BanBajío"
                                className="banbajio-logo-inline"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonativoSection;