import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import "./ImageManager.scss"; // Estilos

const ImageManager = () => {
  const [images, setImages] = useState([]); // Lista de imágenes
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 📌 Cargar imágenes al iniciar
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const imagesRef = ref(storage, "Home/");
    const imageList = await listAll(imagesRef);
    const urls = await Promise.all(imageList.items.map((item) => getDownloadURL(item)));
    setImages(urls);
  };

  // 📌 Seleccionar imagen
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 📌 Subir imagen a Firebase Storage
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const storageRef = ref(storage, `Home/${selectedFile.name}`);

    try {
      await uploadBytes(storageRef, selectedFile);
      fetchImages(); // Recargar imágenes
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
    setUploading(false);
  };

  // 📌 Eliminar imagen de Firebase Storage
  const handleDelete = async (imageUrl) => {
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
      fetchImages(); // Recargar imágenes
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
    }
  };

  return (
    <div className="image-manager">
      <h2>Administrar Imágenes</h2>

      {/* 📌 Subir Imagen */}
      <div className="upload-section">
        <input className="eleArch" type="file" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Vista previa" className="preview" />}
        <button onClick={handleUpload} disabled={!selectedFile || uploading}>
          {uploading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </div>

      {/* 📌 Lista de Imágenes */}
      <div className="image-list">
        {images.map((img, index) => (
          <div key={index} className="image-item">
            <img src={img} alt="Subida" />
            <button onClick={() => handleDelete(img)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;
