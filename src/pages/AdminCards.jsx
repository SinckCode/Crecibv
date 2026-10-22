import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { compressImage } from '../lib/compressImage';
import FormSection from '../components/admin/FormSection';
import FormActions from '../components/admin/FormActions';
import '../components/admin/AdminComponents.scss';
import './AdminCards.scss';

// Tope antes de comprimir. Una foto de celular o camara entra de sobra; lo
// que no entra suele ser un archivo que no deberia ir a una tarjeta.
const MAX_FILE_MB = 15;

/**
 * Convierte el nombre del archivo en algo seguro y unico.
 *
 * El codigo anterior guardaba en `cards/<nombre del archivo>`: dos personas
 * subiendo "foto.jpg" se pisaban la imagen una a la otra sin aviso.
 */
const storagePathFor = (file) => {
  const clean = file.name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return `cards/${Date.now()}-${clean || 'imagen'}.jpg`;
};

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);

  const [form, setForm] = useState({ title: '', description: '' });
  const [newFile, setNewFile] = useState(null);
  const [newPreview, setNewPreview] = useState('');

  const [editCard, setEditCard] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cards'));
        setCards(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        setMessage({
          type: 'error',
          text: 'No se pudieron cargar las tarjetas. Revise su conexion y recargue la pagina.',
        });
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, []);

  const closeModal = useCallback(() => {
    setEditCard(null);
    setEditFile(null);
    setEditPreview('');
  }, []);

  // El modal se cierra con Escape. Sin esto, quien navega con teclado queda
  // atrapado dentro y tiene que buscar el boton Cancelar con el raton.
  // Mientras esta abierto se bloquea el desplazamiento del fondo, que si no
  // se mueve detras del modal al usar la rueda.
  useEffect(() => {
    if (!editCard) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) closeModal();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [editCard, saving, closeModal]);

  /**
   * Cierra el modal al pulsar fuera de el. Se compara el objetivo con el
   * propio fondo para no cerrarlo cuando el clic nace dentro del contenido.
   * No cierra mientras se guarda: interrumpir una subida a medias dejaria a
   * la persona sin saber si el cambio se aplico.
   */
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !saving) closeModal();
  };

  /** Valida el archivo elegido y prepara su vista previa. */
  const pickFile = (file, setFile, setPreview) => {
    if (!file) {
      setFile(null);
      setPreview('');
      return;
    }

    if (file.type.indexOf('image/') !== 0) {
      setMessage({ type: 'error', text: 'Ese archivo no es una imagen. Elija un JPG o un PNG.' });
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: `La imagen pesa demasiado (maximo ${MAX_FILE_MB} MB). Elija otra.`,
      });
      return;
    }

    setMessage({ type: '', text: '' });
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /** Comprime y sube la imagen informando el avance. */
  const uploadImage = async (file) => {
    const optimized = await compressImage(file);
    const task = uploadBytesResumable(ref(storage, storagePathFor(optimized)), optimized);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          if (!snapshot.totalBytes) return;
          setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        reject,
        () => getDownloadURL(task.snapshot.ref).then(resolve).catch(reject),
      );
    });
  };

  /**
   * Borra una imagen de Storage. Nunca se llama antes de que el cambio quede
   * guardado: si se borrara primero y la subida fallara, la tarjeta se
   * quedaria sin imagen y la anterior ya no existiria.
   */
  const deleteImageFromStorage = async (imageUrl) => {
    if (!imageUrl || imageUrl.indexOf('firebasestorage.googleapis.com') === -1) return;
    try {
      await deleteObject(ref(storage, imageUrl));
    } catch (err) {
      // Que no se pueda borrar la imagen vieja no debe romper la operacion:
      // lo importante, el cambio en la tarjeta, ya quedo guardado.
      console.error('No se pudo eliminar la imagen anterior:', err);
    }
  };

  const handleAddCard = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'La tarjeta necesita un titulo.' });
      return;
    }

    setSaving(true);
    setProgress(null);
    setMessage({ type: '', text: '' });

    try {
      const imageUrl = newFile ? await uploadImage(newFile) : '';
      const card = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: imageUrl,
      };

      const docRef = await addDoc(collection(db, 'cards'), card);

      setCards((prev) => [...prev, { id: docRef.id, ...card }]);
      setForm({ title: '', description: '' });
      setNewFile(null);
      setNewPreview('');
      setMessage({ type: 'success', text: 'Tarjeta agregada correctamente.' });
    } catch (err) {
      console.error('Error al agregar la tarjeta:', err);
      setMessage({
        type: 'error',
        text: 'No se pudo guardar la tarjeta. Revise su conexion e intentelo de nuevo.',
      });
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  const handleUpdateCard = async () => {
    if (!editCard.title.trim()) {
      setMessage({ type: 'error', text: 'La tarjeta necesita un titulo.' });
      return;
    }

    setSaving(true);
    setProgress(null);
    setMessage({ type: '', text: '' });

    const previousImage = editCard.image;

    try {
      const imageUrl = editFile ? await uploadImage(editFile) : editCard.image || '';
      const updated = {
        title: editCard.title.trim(),
        description: (editCard.description || '').trim(),
        image: imageUrl,
      };

      await updateDoc(doc(db, 'cards', editCard.id), updated);

      // Ya guardado: ahora si es seguro borrar la imagen que quedo huerfana.
      if (editFile && previousImage && previousImage !== imageUrl) {
        await deleteImageFromStorage(previousImage);
      }

      setCards((prev) =>
        prev.map((card) => (card.id === editCard.id ? { id: card.id, ...updated } : card)),
      );
      closeModal();
      setMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
    } catch (err) {
      console.error('Error al guardar la tarjeta:', err);
      setMessage({
        type: 'error',
        text: 'No se pudieron guardar los cambios. Revise su conexion e intentelo de nuevo.',
      });
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  const handleDelete = async (card) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await deleteDoc(doc(db, 'cards', card.id));
      if (card.image) await deleteImageFromStorage(card.image);

      setCards((prev) => prev.filter((c) => c.id !== card.id));
      setPendingDelete(null);
      setMessage({ type: 'success', text: 'Tarjeta eliminada.' });
    } catch (err) {
      console.error('Error al eliminar la tarjeta:', err);
      setMessage({ type: 'error', text: 'No se pudo eliminar la tarjeta. Intentelo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const savingLabel = progress === null ? 'Guardando...' : `Subiendo imagen... ${progress}%`;

  return (
    <div className="admin-page admin-cards">
      <h2 className="admin-page__title">Tarjetas de servicios</h2>
      <p className="admin-page__subtitle">
        Cada tarjeta es un servicio que se muestra en la pagina principal.
      </p>

      {message.text && (
        <div className={`admin-page__${message.type}`} role="status">
          {message.text}
        </div>
      )}

      <div className="admin-page__card">
        <h3 className="admin-cards__heading">Agregar una tarjeta</h3>

        <FormSection label="Titulo" htmlFor="card-title">
          <input
            id="card-title"
            type="text"
            value={form.title}
            disabled={saving}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </FormSection>

        <FormSection label="Descripcion" htmlFor="card-description">
          <textarea
            id="card-description"
            rows={3}
            value={form.description}
            disabled={saving}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </FormSection>

        <FormSection
          label="Imagen"
          hint={`JPG o PNG, hasta ${MAX_FILE_MB} MB. Se reduce automaticamente antes de subirla.`}
          htmlFor="card-image"
        >
          <input
            id="card-image"
            type="file"
            accept="image/*"
            disabled={saving}
            onChange={(e) => pickFile(e.target.files[0], setNewFile, setNewPreview)}
          />
          {newPreview && (
            <img className="admin-cards__preview" src={newPreview} alt="Vista previa" />
          )}
        </FormSection>

        {saving && progress !== null && (
          <div className="admin-cards__progress" aria-hidden="true">
            <div className="admin-cards__progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}

        <FormActions
          onSave={handleAddCard}
          saving={saving}
          savingLabel={savingLabel}
          saveLabel="Agregar tarjeta"
        />
      </div>

      <h3 className="admin-cards__heading admin-cards__heading--list">
        Tarjetas publicadas {!loadingCards && `(${cards.length})`}
      </h3>

      {loadingCards && <p className="admin-cards__empty">Cargando tarjetas...</p>}

      {!loadingCards && cards.length === 0 && (
        <p className="admin-cards__empty">
          Todavia no hay tarjetas. Agregue la primera con el formulario de arriba.
        </p>
      )}

      <ul className="admin-cards__list">
        {cards.map((card) => (
          <li key={card.id} className="admin-cards__item">
            {card.image ? (
              <img src={card.image} alt={card.title} loading="lazy" />
            ) : (
              <div className="admin-cards__no-image">Sin imagen</div>
            )}

            <div className="admin-cards__item-body">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </div>

            {pendingDelete === card.id ? (
              <div className="admin-cards__confirm">
                <p>Se eliminara esta tarjeta y su imagen. Esta accion no se puede deshacer.</p>
                <div className="card-actions">
                  <button type="button" onClick={() => setPendingDelete(null)} disabled={saving}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDelete(card)}
                    disabled={saving}
                  >
                    Si, eliminar
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-actions">
                <button type="button" onClick={() => setEditCard({ ...card })} disabled={saving}>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setPendingDelete(card.id)}
                  disabled={saving}
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {editCard && (
        <div className="modal" onClick={handleOverlayClick}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-card-heading"
          >
            <h3 id="edit-card-heading">Editar tarjeta</h3>

            <FormSection label="Titulo" htmlFor="edit-card-title">
              <input
                id="edit-card-title"
                type="text"
                value={editCard.title}
                disabled={saving}
                onChange={(e) => setEditCard({ ...editCard, title: e.target.value })}
              />
            </FormSection>

            <FormSection label="Descripcion" htmlFor="edit-card-description">
              <textarea
                id="edit-card-description"
                rows={3}
                value={editCard.description || ''}
                disabled={saving}
                onChange={(e) => setEditCard({ ...editCard, description: e.target.value })}
              />
            </FormSection>

            <FormSection
              label="Imagen"
              hint="Elija un archivo solo si quiere reemplazar la imagen actual."
              htmlFor="edit-card-image"
            >
              <input
                id="edit-card-image"
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={(e) => pickFile(e.target.files[0], setEditFile, setEditPreview)}
              />
              {(editPreview || editCard.image) && (
                <img
                  className="admin-cards__preview"
                  src={editPreview || editCard.image}
                  alt={editPreview ? 'Vista previa de la nueva imagen' : editCard.title}
                />
              )}
            </FormSection>

            {saving && progress !== null && (
              <div className="admin-cards__progress" aria-hidden="true">
                <div className="admin-cards__progress-bar" style={{ width: `${progress}%` }} />
              </div>
            )}

            <FormActions
              onSave={handleUpdateCard}
              onCancel={closeModal}
              saving={saving}
              savingLabel={savingLabel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCards;
