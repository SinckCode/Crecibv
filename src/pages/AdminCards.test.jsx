import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import AdminCards from './AdminCards';

jest.mock('../firebase', () => ({ db: {}, storage: {} }));

// Comprimir usa canvas, que jsdom no implementa. Aqui solo interesa que el
// archivo llegue a la subida, no el resultado de la compresion.
jest.mock('../lib/compressImage', () => ({
  compressImage: (file) => Promise.resolve(file),
}));

const mockGetDocs = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection: (...args) => ({ args }),
  doc: (...args) => ({ args }),
  getDocs: (...args) => mockGetDocs(...args),
  addDoc: (...args) => mockAddDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
}));

const mockUpload = jest.fn();
jest.mock('firebase/storage', () => ({
  ref: (...args) => ({ args }),
  uploadBytesResumable: (...args) => mockUpload(...args),
  getDownloadURL: () => Promise.resolve('https://example.com/nueva.jpg'),
  deleteObject: () => Promise.resolve(),
}));

const cardsSnapshot = (cards) => ({
  docs: cards.map((c) => ({ id: c.id, data: () => c })),
});

const imageFile = () => new File(['x'], 'foto.jpg', { type: 'image/jpeg' });

describe('AdminCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetDocs.mockResolvedValue(cardsSnapshot([]));
    window.URL.createObjectURL = jest.fn(() => 'blob:preview');
    window.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('invites the user to add the first card when there are none', async () => {
    render(<AdminCards />);

    expect(await screen.findByText(/Todavia no hay tarjetas/i)).toBeInTheDocument();
  });

  it('lists the cards that already exist', async () => {
    mockGetDocs.mockResolvedValue(
      cardsSnapshot([{ id: '1', title: 'Braille', description: 'Clases', image: '' }]),
    );

    render(<AdminCards />);

    expect(await screen.findByRole('heading', { name: 'Braille' })).toBeInTheDocument();
    expect(screen.getByText(/Tarjetas publicadas \(1\)/)).toBeInTheDocument();
  });

  it('refuses to save a card without a title', async () => {
    render(<AdminCards />);
    await screen.findByText(/Todavia no hay tarjetas/i);

    await userEvent.click(screen.getByRole('button', { name: /Agregar tarjeta/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/necesita un titulo/i);
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  // Este es el fallo que reporto el profesor: pulsaba guardar con una foto
  // pesada, no pasaba nada visible y daba por hecho que el boton no servia.
  it('reports the upload progress and blocks the button while saving', async () => {
    let emitProgress;
    mockUpload.mockImplementation(() => ({
      snapshot: { ref: {} },
      on: (_event, onProgress) => {
        emitProgress = onProgress;
      },
    }));

    render(<AdminCards />);
    await screen.findByText(/Todavia no hay tarjetas/i);

    await userEvent.type(screen.getByLabelText('Titulo'), 'Tiflotecnologia');
    await userEvent.upload(screen.getByLabelText(/Imagen/), imageFile());
    await userEvent.click(screen.getByRole('button', { name: /Agregar tarjeta/i }));

    await waitFor(() => expect(mockUpload).toHaveBeenCalled());

    act(() => emitProgress({ bytesTransferred: 40, totalBytes: 100 }));

    const button = await screen.findByRole('button', { name: /Subiendo imagen\.\.\. 40%/i });
    expect(button).toBeDisabled();
  });

  it('explains the failure instead of staying silent', async () => {
    mockAddDoc.mockRejectedValue(new Error('sin conexion'));

    render(<AdminCards />);
    await screen.findByText(/Todavia no hay tarjetas/i);

    await userEvent.type(screen.getByLabelText('Titulo'), 'Braille');
    await userEvent.click(screen.getByRole('button', { name: /Agregar tarjeta/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/No se pudo guardar la tarjeta/i);
    expect(screen.getByRole('button', { name: /Agregar tarjeta/i })).toBeEnabled();
  });

  it('asks for confirmation before deleting a card', async () => {
    mockGetDocs.mockResolvedValue(
      cardsSnapshot([{ id: '1', title: 'Braille', description: '', image: '' }]),
    );

    render(<AdminCards />);
    await screen.findByRole('heading', { name: 'Braille' });

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(screen.getByText(/no se puede deshacer/i)).toBeInTheDocument();
    expect(mockDeleteDoc).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /Si, eliminar/i }));

    await waitFor(() => expect(mockDeleteDoc).toHaveBeenCalled());
  });

  it('rejects a file that is not an image', async () => {
    render(<AdminCards />);
    await screen.findByText(/Todavia no hay tarjetas/i);

    // applyAccept: false salta el filtro de accept="image/*" para poder
    // ejercitar la validacion del codigo, que es la que de verdad protege.
    await userEvent.upload(
      screen.getByLabelText(/Imagen/),
      new File(['x'], 'cuentas.pdf', { type: 'application/pdf' }),
      { applyAccept: false },
    );

    expect(screen.getByRole('status')).toHaveTextContent(/no es una imagen/i);
  });
});
