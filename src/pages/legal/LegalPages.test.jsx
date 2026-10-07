import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AvisoPrivacidad from './AvisoPrivacidad';
import TerminosDonativos from './TerminosDonativos';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: true }),
}));

// Evita inicializar Firebase en CI
jest.mock('../../hooks/useSiteSettings', () => ({
  useSiteSettings: () => ({
    settings: require('../../lib/defaultSiteSettings').DEFAULT_SITE_SETTINGS,
    loading: false,
  }),
}));

const renderPage = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

/**
 * Las paginas legales montan el Footer, que tambien enlaza a ambos
 * documentos. Acotar al <article> evita confundir el enlace del pie de
 * pagina con el del cuerpo del texto.
 */
const legalDocument = () => within(screen.getByRole('article'));

describe('Aviso de Privacidad', () => {
  it('renders the title', () => {
    renderPage(<AvisoPrivacidad />);

    expect(
      legalDocument().getByRole('heading', { level: 1, name: /Aviso de Privacidad/i }),
    ).toBeInTheDocument();
  });

  it('identifies the responsable with the real org data', () => {
    renderPage(<AvisoPrivacidad />);

    expect(legalDocument().getByText(/CCR1902216I1/)).toBeInTheDocument();
    // El domicilio aparece dos veces a proposito: en la identificacion del
    // responsable y como lugar para presentar solicitudes ARCO en persona.
    expect(legalDocument().getAllByText(/Calle Alferez 611/)).toHaveLength(2);
  });

  it('discloses the analytics cookies, which the law requires', () => {
    renderPage(<AvisoPrivacidad />);

    expect(legalDocument().getByRole('heading', { name: /Cookies/i })).toBeInTheDocument();
    expect(legalDocument().getAllByText(/Google Analytics/).length).toBeGreaterThan(0);
  });

  it('explains how to exercise ARCO rights', () => {
    renderPage(<AvisoPrivacidad />);

    expect(legalDocument().getByRole('heading', { name: /derechos ARCO/i })).toBeInTheDocument();
    expect(legalDocument().getByText(/veinte días hábiles/i)).toBeInTheDocument();
  });

  it('links to the donation terms', () => {
    renderPage(<AvisoPrivacidad />);

    expect(
      legalDocument().getByRole('link', { name: /Términos y Condiciones de Donativos/i }),
    ).toHaveAttribute('href', '/terminos');
  });
});

describe('Terminos y Condiciones de Donativos', () => {
  it('renders the title', () => {
    renderPage(<TerminosDonativos />);

    expect(
      legalDocument().getByRole('heading', {
        level: 1,
        name: /Términos y Condiciones de Donativos/i,
      }),
    ).toBeInTheDocument();
  });

  it('states that donations are not refundable', () => {
    renderPage(<TerminosDonativos />);

    expect(legalDocument().getByText(/no son reembolsables/i)).toBeInTheDocument();
  });

  it('warns that external platforms may prevent issuing a CFDI', () => {
    renderPage(<TerminosDonativos />);

    expect(
      legalDocument().getByText(/puede no ser posible emitir el comprobante/i),
    ).toBeInTheDocument();
  });

  it('commits to not publishing beneficiary images without written consent', () => {
    renderPage(<TerminosDonativos />);

    expect(legalDocument().getByText(/consentimiento previo y por escrito/i)).toBeInTheDocument();
  });

  it('links to the privacy notice', () => {
    renderPage(<TerminosDonativos />);

    expect(legalDocument().getByRole('link', { name: /Aviso de Privacidad/i })).toHaveAttribute(
      'href',
      '/aviso-de-privacidad',
    );
  });
});

describe('Footer legal links', () => {
  it('exposes both documents from the footer of a legal page', () => {
    renderPage(<AvisoPrivacidad />);

    const footerNav = screen.getByRole('navigation', { name: /Enlaces legales/i });

    expect(within(footerNav).getByRole('link', { name: /Aviso de Privacidad/i })).toHaveAttribute(
      'href',
      '/aviso-de-privacidad',
    );
    expect(
      within(footerNav).getByRole('link', { name: /Términos y Condiciones de Donativos/i }),
    ).toHaveAttribute('href', '/terminos');
  });
});
