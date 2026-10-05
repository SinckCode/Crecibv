import React, { useEffect } from 'react';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import BackToTop from '../../components/BackToTop';

import './LegalPage.scss';

/**
 * Envoltura comun de las paginas legales. Mantiene la misma cabecera y pie
 * que el resto del sitio y centra el texto a un ancho comodo de lectura.
 */
const LegalLayout = ({ title, lastUpdated, children }) => {
  // Al entrar desde el pie de pagina la vista conserva el scroll anterior
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="legal-page">
        <article className="legal-page__content">
          <h1 className="legal-page__title">{title}</h1>
          <p className="legal-page__updated">Última actualización: {lastUpdated}</p>
          {children}
        </article>
      </main>
      <BackToTop />
      <Footer />
    </>
  );
};

export default LegalLayout;
