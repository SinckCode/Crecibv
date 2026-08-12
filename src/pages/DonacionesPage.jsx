import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import BackToTop from '../components/BackToTop';
import DonativoSection from './DonativoSection';

import './DonacionesPage.scss';

const DonacionesPage = () => {
  return (
    <>
      <Header />
      <main className="donaciones-page">
        <DonativoSection />
      </main>
      <BackToTop />
      <Footer />
    </>
  );
};

export default DonacionesPage;
