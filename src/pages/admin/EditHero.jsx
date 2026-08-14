import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import FormSection from '../../components/admin/FormSection';
import FormActions from '../../components/admin/FormActions';
import '../../components/admin/AdminComponents.scss';

const EditHero = () => {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState({
    heroTitle: '',
    heroCtaText: '',
    heroCtaLink: '',
    bannerText: '',
    bannerCtaText: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      setForm({
        heroTitle: settings.hero.title,
        heroCtaText: settings.hero.ctaText,
        heroCtaLink: settings.hero.ctaLink,
        bannerText: settings.donationBanner.text,
        bannerCtaText: settings.donationBanner.ctaText,
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
          hero: {
            title: form.heroTitle,
            ctaText: form.heroCtaText,
            ctaLink: form.heroCtaLink,
          },
          donationBanner: {
            text: form.bannerText,
            ctaText: form.bannerCtaText,
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
      <h1 className="admin-page__title">Pagina Principal</h1>
      <p className="admin-page__subtitle">Edita el contenido del hero y el banner de donacion</p>

      <div className="admin-page__card">
        {message.text && <div className={`admin-page__${message.type}`}>{message.text}</div>}

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Seccion Hero</h3>

        <FormSection
          label="Titulo principal"
          hint="El texto grande que aparece sobre las imagenes al inicio"
          htmlFor="hero-title"
        >
          <input
            id="hero-title"
            type="text"
            value={form.heroTitle}
            onChange={handleChange('heroTitle')}
          />
        </FormSection>

        <FormSection
          label="Texto del boton"
          hint="El texto del boton de accion (ej: APOYAR)"
          htmlFor="hero-cta"
        >
          <input
            id="hero-cta"
            type="text"
            value={form.heroCtaText}
            onChange={handleChange('heroCtaText')}
          />
        </FormSection>

        <FormSection
          label="Enlace del boton"
          hint="A donde lleva el boton (ej: /donaciones)"
          htmlFor="hero-link"
        >
          <input
            id="hero-link"
            type="text"
            value={form.heroCtaLink}
            onChange={handleChange('heroCtaLink')}
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Banner de Donacion</h3>

        <FormSection
          label="Texto del banner"
          hint="Aparece cuando el usuario baja la pagina"
          htmlFor="banner-text"
        >
          <textarea
            id="banner-text"
            value={form.bannerText}
            onChange={handleChange('bannerText')}
          />
        </FormSection>

        <FormSection label="Texto del boton del banner" htmlFor="banner-cta">
          <input
            id="banner-cta"
            type="text"
            value={form.bannerCtaText}
            onChange={handleChange('bannerCtaText')}
          />
        </FormSection>

        <FormActions onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
};

export default EditHero;
