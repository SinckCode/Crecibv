import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CookieConsent from './CookieConsent';
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  CONSENT_KEY,
  resetAnalyticsForTests,
} from '../lib/analytics';

const renderBanner = () =>
  render(
    <MemoryRouter>
      <CookieConsent />
    </MemoryRouter>,
  );

// Testing Library solo consulta elementos accesibles, y un <script> no lo es.
// Comprobar si el script existe es justamente el punto de estos tests: es la
// prueba de que rechazar impide la medicion de verdad.
// eslint-disable-next-line testing-library/no-node-access
const gtagScript = () => document.querySelector('script[src*="googletagmanager.com"]');
// eslint-disable-next-line testing-library/no-node-access
const metaPixelScript = () => document.querySelector('script[src*="connect.facebook.net"]');

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetAnalyticsForTests();
    delete window.gtag;
    delete window.dataLayer;
    delete window.fbq;
    delete window._fbq;
    // eslint-disable-next-line testing-library/no-node-access
    document.querySelectorAll('script[src*="googletagmanager.com"]').forEach((el) => el.remove());
    // eslint-disable-next-line testing-library/no-node-access
    document.querySelectorAll('script[src*="connect.facebook.net"]').forEach((el) => el.remove());
    // Los IDs solo existen cuando el workflow los inyecta al compilar
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID = 'G-TESTID1234';
    process.env.REACT_APP_META_PIXEL_ID = '000000000000000';
  });

  it('asks for a decision when the visitor has not made one', () => {
    renderBanner();

    expect(screen.getByRole('region', { name: /Aviso de cookies/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument();
  });

  it('does not load analytics before a decision is made', () => {
    renderBanner();

    expect(gtagScript()).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it('does not load the Meta pixel before a decision is made', () => {
    renderBanner();

    expect(metaPixelScript()).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('links to the privacy notice', () => {
    renderBanner();

    expect(screen.getByRole('link', { name: /Aviso de Privacidad/i })).toHaveAttribute(
      'href',
      '/aviso-de-privacidad',
    );
  });

  it('loads analytics and remembers the choice when accepted', async () => {
    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    expect(window.localStorage.getItem(CONSENT_KEY)).toBe(CONSENT_GRANTED);
    expect(gtagScript()).not.toBeNull();
    expect(screen.queryByRole('region', { name: /Aviso de cookies/i })).not.toBeInTheDocument();
  });

  it('loads the Meta pixel when accepted', async () => {
    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    expect(metaPixelScript()).not.toBeNull();
    expect(typeof window.fbq).toBe('function');
  });

  it('never loads the Meta pixel when rejected', async () => {
    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Rechazar/i }));

    expect(metaPixelScript()).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('keeps the Meta pixel off on a later visit after rejecting', () => {
    window.localStorage.setItem(CONSENT_KEY, CONSENT_DENIED);

    renderBanner();

    expect(metaPixelScript()).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('does not load the Meta pixel when no pixel ID is configured', async () => {
    delete process.env.REACT_APP_META_PIXEL_ID;

    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    // Analytics si carga: un medidor sin configurar no debe tumbar al otro
    expect(gtagScript()).not.toBeNull();
    expect(metaPixelScript()).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('ignores a placeholder pixel ID', async () => {
    process.env.REACT_APP_META_PIXEL_ID = 'your_meta_pixel_id';

    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    expect(metaPixelScript()).toBeNull();
    expect(window.fbq).toBeUndefined();
  });

  it('never loads analytics when rejected', async () => {
    renderBanner();
    await userEvent.click(screen.getByRole('button', { name: /Rechazar/i }));

    expect(window.localStorage.getItem(CONSENT_KEY)).toBe(CONSENT_DENIED);
    expect(gtagScript()).toBeNull();
    expect(window.gtag).toBeUndefined();
    expect(screen.queryByRole('region', { name: /Aviso de cookies/i })).not.toBeInTheDocument();
  });

  it('stays hidden and loads analytics on a later visit after accepting', () => {
    window.localStorage.setItem(CONSENT_KEY, CONSENT_GRANTED);

    renderBanner();

    expect(screen.queryByRole('region', { name: /Aviso de cookies/i })).not.toBeInTheDocument();
    expect(gtagScript()).not.toBeNull();
  });

  it('stays hidden and keeps analytics off on a later visit after rejecting', () => {
    window.localStorage.setItem(CONSENT_KEY, CONSENT_DENIED);

    renderBanner();

    expect(screen.queryByRole('region', { name: /Aviso de cookies/i })).not.toBeInTheDocument();
    expect(gtagScript()).toBeNull();
  });
});
