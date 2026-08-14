import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import FormSection from '../../components/admin/FormSection';
import FormActions from '../../components/admin/FormActions';
import '../../components/admin/AdminComponents.scss';

const EditSettings = () => {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState({
    fullName: '',
    shortName: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      setForm({
        fullName: settings.orgInfo.fullName,
        shortName: settings.orgInfo.shortName,
        description: settings.orgInfo.description,
      });
    }
  }, [loading, settings]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(
        doc(db, 'content', 'siteSettings'),
        {
          orgInfo: {
            fullName: form.fullName,
            shortName: form.shortName,
            description: form.description,
          },
        },
        { merge: true },
      );
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
      <h1 className="admin-page__title">Informacion General</h1>
      <p className="admin-page__subtitle">
        Datos basicos de la organizacion que aparecen en toda la pagina
      </p>

      <div className="admin-page__card">
        {message.text && <div className={`admin-page__${message.type}`}>{message.text}</div>}

        <FormSection
          label="Nombre completo"
          hint="Nombre legal completo de la organizacion"
          htmlFor="org-full"
        >
          <input
            id="org-full"
            type="text"
            value={form.fullName}
            onChange={handleChange('fullName')}
          />
        </FormSection>

        <FormSection
          label="Nombre corto"
          hint="Se usa en el header, footer y titulo de la pagina (ej: CRECIBV, A.C.)"
          htmlFor="org-short"
        >
          <input
            id="org-short"
            type="text"
            value={form.shortName}
            onChange={handleChange('shortName')}
          />
        </FormSection>

        <FormSection
          label="Descripcion breve"
          hint="Aparece debajo del nombre en el footer"
          htmlFor="org-desc"
        >
          <textarea id="org-desc" value={form.description} onChange={handleChange('description')} />
        </FormSection>

        <FormActions onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
};

export default EditSettings;
