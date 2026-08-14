import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import FormSection from '../../components/admin/FormSection';
import FormActions from '../../components/admin/FormActions';
import '../../components/admin/AdminComponents.scss';

const EditDonations = () => {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState({
    sectionTitle1: '',
    sectionTitle2: '',
    awarenessMessage: '',
    callToAction: '',
    bankName: '',
    clabe: '',
    bankLogoURL: '',
    donationImageURL: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      setForm({
        sectionTitle1: settings.donations.sectionTitle1,
        sectionTitle2: settings.donations.sectionTitle2,
        awarenessMessage: settings.donations.awarenessMessage,
        callToAction: settings.donations.callToAction,
        bankName: settings.donations.bankName,
        clabe: settings.donations.clabe,
        bankLogoURL: settings.donations.bankLogoURL,
        donationImageURL: settings.donations.donationImageURL,
      });
    }
  }, [loading, settings]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleImageUpload = (field) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `${field}-${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `donations/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm({ ...form, [field]: url });
      setMessage({ type: 'success', text: 'Imagen subida correctamente.' });
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setMessage({ type: 'error', text: 'Error al subir la imagen.' });
    }
  };

  const handleSave = async () => {
    if (form.clabe && !/^\d{18}$/.test(form.clabe)) {
      setMessage({ type: 'error', text: 'La CLABE debe tener exactamente 18 digitos.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(doc(db, 'content', 'siteSettings'), { donations: { ...form } }, { merge: true });
      setMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
    } catch (err) {
      console.error('Error guardando:', err);
      setMessage({ type: 'error', text: 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Donaciones</h1>
      <p className="admin-page__subtitle">
        Edita los datos bancarios y textos de la seccion de donaciones
      </p>

      <div className="admin-page__card">
        {message.text && <div className={`admin-page__${message.type}`}>{message.text}</div>}

        <FormSection label="Titulo linea 1" htmlFor="don-t1">
          <input
            id="don-t1"
            type="text"
            value={form.sectionTitle1}
            onChange={handleChange('sectionTitle1')}
          />
        </FormSection>

        <FormSection label="Titulo linea 2" htmlFor="don-t2">
          <input
            id="don-t2"
            type="text"
            value={form.sectionTitle2}
            onChange={handleChange('sectionTitle2')}
          />
        </FormSection>

        <FormSection
          label="Mensaje de concientizacion"
          hint="Texto que inspira a las personas a donar"
          htmlFor="don-awareness"
        >
          <textarea
            id="don-awareness"
            value={form.awarenessMessage}
            onChange={handleChange('awarenessMessage')}
          />
        </FormSection>

        <FormSection
          label="Llamado a la accion"
          hint="Segundo parrafo motivacional"
          htmlFor="don-cta"
        >
          <textarea
            id="don-cta"
            value={form.callToAction}
            onChange={handleChange('callToAction')}
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Datos Bancarios</h3>

        <FormSection label="Nombre del banco" htmlFor="don-bank">
          <input
            id="don-bank"
            type="text"
            value={form.bankName}
            onChange={handleChange('bankName')}
          />
        </FormSection>

        <FormSection label="CLABE interbancaria" hint="18 digitos exactos" htmlFor="don-clabe">
          <input
            id="don-clabe"
            type="text"
            value={form.clabe}
            onChange={handleChange('clabe')}
            maxLength={18}
            pattern="\d{18}"
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Imagenes</h3>

        <FormSection
          label="Logo del banco"
          hint="Imagen que aparece junto a la CLABE"
          htmlFor="don-logo"
        >
          <input
            id="don-logo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload('bankLogoURL')}
          />
          {form.bankLogoURL && (
            <img
              src={form.bankLogoURL}
              alt="Logo del banco"
              style={{ maxHeight: 60, marginTop: 8 }}
            />
          )}
        </FormSection>

        <FormSection
          label="Imagen de la seccion"
          hint="Ilustracion que acompana los textos"
          htmlFor="don-img"
        >
          <input
            id="don-img"
            type="file"
            accept="image/*"
            onChange={handleImageUpload('donationImageURL')}
          />
          {form.donationImageURL && (
            <img
              src={form.donationImageURL}
              alt="Imagen donacion"
              style={{ maxHeight: 120, marginTop: 8, borderRadius: 8 }}
            />
          )}
        </FormSection>

        <FormActions onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
};

export default EditDonations;
