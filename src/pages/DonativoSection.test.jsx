import { render, screen } from '@testing-library/react';
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
});
