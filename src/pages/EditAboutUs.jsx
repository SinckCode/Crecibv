import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./EditAboutUs.scss";

const EditAboutUs = () => {
  const [aboutData, setAboutData] = useState({
    section1: { paragraph1: "", paragraph2: "" },
    section2: { mission: "", vision: "" },
    section3: { info: "" },
    imageURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // 🔹 Cargar datos de Firestore
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "content", "aboutUs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutData(docSnap.data());
          setPreviewImage(docSnap.data().imageURL || "");
        } else {
          console.error("No se encontró la información de About Us.");
        }
      } catch (error) {
        console.error("Error al cargar datos de About Us:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (section, field, value) => {
    setAboutData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  // 🔹 Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 🔹 Subir imagen a Firebase Storage
  const uploadImage = async () => {
    if (!selectedImage) return aboutData.imageURL;

    try {
      const storageRef = ref(storage, `aboutUs/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("❌ Error al subir la imagen.");
      return aboutData.imageURL;
    }
  };

  // 🔹 Guardar cambios en Firestore
  const handleSave = async () => {
    setSaving(true);
    try {
      const imageURL = await uploadImage();
      const docRef = doc(db, "content", "aboutUs");

      await updateDoc(docRef, { ...aboutData, imageURL });
      alert("✅ Información actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      alert("❌ Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-about-us">
      <h2>Editar Información - Acerca de Nosotros</h2>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          {/* 📌 Imagen */}
          <div className="section">
            <h3>Imagen de la Sección</h3>
            {previewImage && <img src={previewImage} alt="Vista previa" className="preview-img" />}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* 📌 Sección 1 */}
          <div className="section">
            <h3>Sección 1</h3>
            <textarea
              value={aboutData.section1.paragraph1}
              onChange={(e) => handleChange("section1", "paragraph1", e.target.value)}
              placeholder="Primer párrafo..."
            />
            <textarea
              value={aboutData.section1.paragraph2}
              onChange={(e) => handleChange("section1", "paragraph2", e.target.value)}
              placeholder="Segundo párrafo..."
            />
          </div>

          {/* 📌 Sección 2 */}
          <div className="section">
            <h3>Sección 2</h3>
            <textarea
              value={aboutData.section2.mission}
              onChange={(e) => handleChange("section2", "mission", e.target.value)}
              placeholder="Misión..."
            />
            <textarea
              value={aboutData.section2.vision}
              onChange={(e) => handleChange("section2", "vision", e.target.value)}
              placeholder="Visión..."
            />
          </div>

          {/* 📌 Sección 3 */}
          <div className="section">
            <h3>Sección 3</h3>
            <textarea
              value={aboutData.section3.info}
              onChange={(e) => handleChange("section3", "info", e.target.value)}
              placeholder="Información adicional..."
            />
          </div>

          {/* 📌 Botones */}
          <div className="button-group">
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button className="cancel-btn" onClick={() => window.location.reload()}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditAboutUs;
