import { render, screen } from '@testing-library/react';
import DonativoSection from './DonativoSection';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: true }),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ hash: '' }),
}));

// Mock image imports so they resolve to simple strings
jest.mock('../assets/banbajio_logo.png', () => 'banbajio_logo.png');
jest.mock('../assets/donativo_image.jpg', () => 'donativo_image.jpg');

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  global.fetch.mockRestore();
  console.error.mockRestore();
});

describe('DonativoSection', () => {
  it('renders the headings correctly', () => {
    render(<DonativoSection />);

    expect(screen.getByText('HAZ TU')).toBeInTheDocument();
    expect(screen.getByText('DONATIVO')).toBeInTheDocument();
  });

  it('shows default bank info', () => {
    render(<DonativoSection />);

    expect(screen.getByText(/BanBajío/)).toBeInTheDocument();
    expect(screen.getByText('030225900028096394')).toBeInTheDocument();
  });
});
