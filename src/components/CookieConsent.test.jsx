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

describe('CookieConsent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetAnalyticsForTests();
    delete window.gtag;
    delete window.dataLayer;
    // eslint-disable-next-line testing-library/no-node-access
    document.querySelectorAll('script[src*="googletagmanager.com"]').forEach((el) => el.remove());
    // El ID solo existe cuando el workflow lo inyecta al compilar
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID = 'G-TESTID1234';
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
