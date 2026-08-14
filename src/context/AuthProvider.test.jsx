import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('../firebase', () => ({ auth: {} }));

const mockOnAuthStateChanged = jest.fn();
const mockSignOut = jest.fn(() => Promise.resolve());
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signOut: (...args) => mockSignOut(...args),
}));

const Consumer = () => {
  const { currentUser, isAdmin, loading, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser ? currentUser.email : 'none'}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="has-logout">{String(typeof logout === 'function')}</span>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides null currentUser when no user is authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
    expect(screen.getByTestId('has-logout')).toHaveTextContent('true');
  });

  it('sets loading to false after auth state resolves', async () => {
    mockOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });
});
