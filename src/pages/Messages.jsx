import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './Messages.scss';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // Estado para el modal

  const fetchMessages = async () => {
    const querySnapshot = await getDocs(collection(db, 'messages'));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        alert('Mensaje eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el mensaje:', error);
      }
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message); // Muestra el modal con los detalles del mensaje
  };

  const closeModal = () => {
    setSelectedMessage(null); // Cierra el modal
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="messages">
      <h1>Mensajes</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>
                <button onClick={() => handleViewMessage(msg)}>Ver</button>
                <button onClick={() => handleDelete(msg.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para mostrar detalles del mensaje */}
      {selectedMessage && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles del Mensaje</h2>
            <p><strong>Nombre:</strong> {selectedMessage.name}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Mensaje:</strong> {selectedMessage.message}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
