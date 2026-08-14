import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import FormSection from '../../components/admin/FormSection';
import FormActions from '../../components/admin/FormActions';
import { FaPlus, FaTrash } from 'react-icons/fa';
import '../../components/admin/AdminComponents.scss';
import './EditSocialMedia.scss';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const EditSocialMedia = () => {
  const { settings, loading } = useSiteSettings();
  const [links, setLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      setLinks(settings.socialMedia.map((s) => ({ ...s })));
    }
  }, [loading, settings]);

  const handleAdd = () => {
    setLinks([...links, { platform: 'facebook', url: '', label: '' }]);
    setMessage({ type: '', text: '' });
  };

  const handleRemove = (index) => {
    setLinks(links.filter((_, i) => i !== index));
    setMessage({ type: '', text: '' });
  };

  const handleChange = (index, field) => (e) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: e.target.value };
    // Auto-generate label from platform name
    if (field === 'platform') {
      const platform = PLATFORMS.find((p) => p.value === e.target.value);
      if (platform && !updated[index].label) {
        updated[index].label = platform.label;
      }
    }
    setLinks(updated);
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    // Validate all have URLs
    const invalid = links.some((l) => !l.url.trim());
    if (invalid) {
      setMessage({ type: 'error', text: 'Todas las redes sociales deben tener una URL.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(doc(db, 'content', 'siteSettings'), { socialMedia: links }, { merge: true });
      setMessage({ type: 'success', text: 'Redes sociales guardadas correctamente.' });
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
      <h1 className="admin-page__title">Redes Sociales</h1>
      <p className="admin-page__subtitle">
        Agrega, edita o elimina los enlaces a redes sociales que aparecen en el footer
      </p>

      <div className="admin-page__card">
        {message.text && <div className={`admin-page__${message.type}`}>{message.text}</div>}

        {links.map((link, index) => (
          <div key={index} className="social-entry">
            <div className="social-entry__fields">
              <FormSection label="Plataforma" htmlFor={`social-platform-${index}`}>
                <select
                  id={`social-platform-${index}`}
                  value={link.platform}
                  onChange={handleChange(index, 'platform')}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </FormSection>

              <FormSection label="URL" htmlFor={`social-url-${index}`}>
                <input
                  id={`social-url-${index}`}
                  type="url"
                  value={link.url}
                  onChange={handleChange(index, 'url')}
                  placeholder="https://..."
                />
              </FormSection>

              <FormSection label="Etiqueta" htmlFor={`social-label-${index}`}>
                <input
                  id={`social-label-${index}`}
                  type="text"
                  value={link.label}
                  onChange={handleChange(index, 'label')}
                  placeholder="Facebook"
                />
              </FormSection>
            </div>

            <button
              type="button"
              className="social-entry__remove"
              onClick={() => handleRemove(index)}
              aria-label="Eliminar red social"
            >
              <FaTrash />
            </button>
          </div>
        ))}

        <button type="button" className="social-add-btn" onClick={handleAdd}>
          <FaPlus /> Agregar Red Social
        </button>

        <FormActions onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
};

export default EditSocialMedia;
