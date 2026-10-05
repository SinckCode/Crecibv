import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DonativoSection from './DonativoSection';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: true }),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ hash: '' }),
}));

// Mock useSiteSettings to avoid Firebase initialization in CI
jest.mock('../hooks/useSiteSettings', () => ({
  useSiteSettings: () => ({
    settings: require('../lib/defaultSiteSettings').DEFAULT_SITE_SETTINGS,
    loading: false,
  }),
}));

// Mock image imports so they resolve to simple strings
jest.mock('../assets/banbajio_logo.png', () => 'banbajio_logo.png');
jest.mock('../assets/donativo_image.jpg', () => 'donativo_image.jpg');

describe('DonativoSection', () => {
  it('renders the headings correctly', () => {
    render(<DonativoSection />);

    expect(screen.getByText('HAZ TU')).toBeInTheDocument();
    expect(screen.getByText('DONATIVO')).toBeInTheDocument();
  });

  it('shows default bank info', () => {
    render(<DonativoSection />);

    expect(screen.getByText(/BanBajio/)).toBeInTheDocument();
    expect(screen.getByText('030225900028096394')).toBeInTheDocument();
  });

  it('shows the highlight notice without any tax-deduction claim', () => {
    render(<DonativoSection />);

    expect(screen.getByText(/Cada aportación cuenta/i)).toBeInTheDocument();
    // La deducibilidad se trata directamente con cada donante empresarial,
    // no se anuncia de forma abierta en el sitio.
    expect(screen.queryByText(/deducible|donataria autorizada/i)).not.toBeInTheDocument();
  });

  it('links the primary button to the donation platform', () => {
    render(<DonativoSection />);

    const cta = screen.getByRole('link', { name: 'Donar ahora' });
    expect(cta).toHaveAttribute('href', 'https://gofund.me/79d66684c');
    expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('builds the WhatsApp link with the prefilled message', () => {
    render(<DonativoSection />);

    const whatsapp = screen.getByRole('link', { name: /WhatsApp/i });
    expect(whatsapp).toHaveAttribute(
      'href',
      'https://wa.me/524772017851?text=Hola%2C%20quiero%20hacer%20un%20donativo%20a%20CRECIBV.',
    );
  });

  it('lists the suggested amounts with their impact', () => {
    render(<DonativoSection />);

    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText(/Un mes de traslados/)).toBeInTheDocument();
  });

  it('copies the CLABE and reports it to the user', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<DonativoSection />);
    await userEvent.click(screen.getByRole('button', { name: /Copiar CLABE/i }));

    expect(writeText).toHaveBeenCalledWith('030225900028096394');
    expect(await screen.findByText(/CLABE copiada/i)).toBeInTheDocument();
  });

  it('reports the donation click to analytics when gtag is present', async () => {
    window.gtag = jest.fn();

    render(<DonativoSection />);
    await userEvent.click(screen.getByRole('link', { name: 'Donar ahora' }));

    expect(window.gtag).toHaveBeenCalledWith('event', 'click_donar_gofundme', { value: 1 });

    delete window.gtag;
  });
});
