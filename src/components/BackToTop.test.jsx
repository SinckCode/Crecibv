import { render, screen, fireEvent } from '@testing-library/react';
import BackToTop from './BackToTop';

describe('BackToTop', () => {
  it('is not visible when scroll is at top', () => {
    render(<BackToTop />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes visible when user scrolls down', () => {
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('scrolls to top when clicked', () => {
    window.scrollTo = jest.fn();
    render(<BackToTop />);

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);

    fireEvent.click(screen.getByRole('button'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
