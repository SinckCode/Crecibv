import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import './AdminCards.scss';

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ title: '', description: '', image: null });
  const [editCard, setEditCard] = useState(null); // Estado para editar tarjetas
  const [imageFile, setImageFile] = useState(null); // Imagen a subir

  // 🔥 Cargar tarjetas desde Firebase
  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, 'cards'));
      const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
    };

    fetchCards();
  }, []);

  // 🔥 Subir imagen a Firebase Storage y obtener URL
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `cards/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // 🔥 Agregar una tarjeta
  const handleAddCard = async () => {
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const docRef = await addDoc(collection(db, 'cards'), { ...newCard, image: imageUrl });
    setCards([...cards, { id: docRef.id, ...newCard, image: imageUrl }]);
    setNewCard({ title: '', description: '', image: null });
    setImageFile(null);
  };

  // 🔥 Eliminar una tarjeta
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'cards', id));
    setCards(cards.filter(card => card.id !== id));
  };

  // 🔥 Editar tarjeta - Mostrar modal
  const openEditModal = (card) => {
    setEditCard(card);
  };

  // 🔥 Guardar cambios en la tarjeta editada
  const handleUpdateCard = async () => {
    let updatedImageUrl = editCard.image;

    if (imageFile) {
      updatedImageUrl = await uploadImage(imageFile);
    }

    await updateDoc(doc(db, 'cards', editCard.id), { ...editCard, image: updatedImageUrl });

    setCards(cards.map(card => (card.id === editCard.id ? { ...editCard, image: updatedImageUrl } : card)));
    setEditCard(null);
    setImageFile(null);
  };

  return (
    <div className="admin-cards">
      <h2>Administrar Tarjetas</h2>

      {/* 🔥 Formulario para agregar tarjeta */}
      <div className="add-card">
        <input type="text" name="title" placeholder="Título" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} />
        <input type="text" name="description" placeholder="Descripción" value={newCard.description} onChange={(e) => setNewCard({ ...newCard, description: e.target.value })} />
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        <button onClick={handleAddCard}>Agregar</button>
      </div>

      {/* 🔥 Lista de tarjetas */}
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            <h3>{card.title}</h3>
            <img src={card.image} alt={card.title} />
            <p>{card.description}</p>
            <button onClick={() => openEditModal(card)}>Editar</button>
            <button onClick={() => handleDelete(card.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* 🔥 Modal para editar tarjeta */}
      {editCard && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Tarjeta</h3>
            <div className="titulo">
            <h4>Título</h4>
            <input type="text" value={editCard.title} onChange={(e) => setEditCard({ ...editCard, title: e.target.value })} />
            </div>

            <div className="descrip">
            <h4>Descripción</h4>
            <textarea type="text" value={editCard.description} onChange={(e) => setEditCard({ ...editCard, description: e.target.value })} />
            </div>

            <div className="img">
            <h4>Imágen</h4>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            <img src={editCard.image} alt={editCard.title} />
            </div>

            <div className="buttons">
            <button onClick={handleUpdateCard}>Guardar</button>
            <button onClick={() => setEditCard(null)}>Cancelar</button>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCards;
