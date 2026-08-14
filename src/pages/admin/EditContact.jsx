import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import FormSection from '../../components/admin/FormSection';
import FormActions from '../../components/admin/FormActions';
import '../../components/admin/AdminComponents.scss';

const EditContact = () => {
  const { settings, loading } = useSiteSettings();
  const [form, setForm] = useState({
    street: '',
    colony: '',
    city: '',
    state: '',
    country: '',
    full: '',
    phone: '',
    email: '',
    hours: '',
    embedURL: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading) {
      const { address, phone, email, hours } = settings.orgInfo;
      setForm({
        street: address.street,
        colony: address.colony,
        city: address.city,
        state: address.state,
        country: address.country,
        full: address.full,
        phone,
        email,
        hours,
        embedURL: settings.maps.embedURL,
      });
    }
  }, [loading, settings]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate full address
      if (['street', 'colony', 'city', 'state', 'country'].includes(field)) {
        next.full = [next.street, next.colony, next.city, next.state, next.country]
          .filter(Boolean)
          .join(', ');
      }
      return next;
    });
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
            address: {
              street: form.street,
              colony: form.colony,
              city: form.city,
              state: form.state,
              country: form.country,
              full: form.full,
            },
            phone: form.phone,
            email: form.email,
            hours: form.hours,
          },
          maps: {
            embedURL: form.embedURL,
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
      <h1 className="admin-page__title">Contacto y Ubicacion</h1>
      <p className="admin-page__subtitle">Edita la direccion, datos de contacto y mapa</p>

      <div className="admin-page__card">
        {message.text && <div className={`admin-page__${message.type}`}>{message.text}</div>}

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Direccion</h3>

        <FormSection label="Calle y numero" htmlFor="addr-street">
          <input
            id="addr-street"
            type="text"
            value={form.street}
            onChange={handleChange('street')}
          />
        </FormSection>

        <FormSection label="Colonia" htmlFor="addr-colony">
          <input
            id="addr-colony"
            type="text"
            value={form.colony}
            onChange={handleChange('colony')}
          />
        </FormSection>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <FormSection label="Ciudad" htmlFor="addr-city">
            <input id="addr-city" type="text" value={form.city} onChange={handleChange('city')} />
          </FormSection>
          <FormSection label="Estado" htmlFor="addr-state">
            <input
              id="addr-state"
              type="text"
              value={form.state}
              onChange={handleChange('state')}
            />
          </FormSection>
        </div>

        <FormSection label="Pais" htmlFor="addr-country">
          <input
            id="addr-country"
            type="text"
            value={form.country}
            onChange={handleChange('country')}
          />
        </FormSection>

        <FormSection
          label="Direccion completa"
          hint="Se genera automaticamente, pero puedes editarla manualmente"
          htmlFor="addr-full"
        >
          <input id="addr-full" type="text" value={form.full} onChange={handleChange('full')} />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Datos de Contacto</h3>

        <FormSection label="Telefono" htmlFor="contact-phone">
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
          />
        </FormSection>

        <FormSection label="Correo electronico" htmlFor="contact-email">
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
          />
        </FormSection>

        <FormSection label="Horarios de atencion" htmlFor="contact-hours">
          <input
            id="contact-hours"
            type="text"
            value={form.hours}
            onChange={handleChange('hours')}
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Mapa de Google</h3>

        <FormSection
          label="URL del mapa embebido"
          hint="Ve a Google Maps > Compartir > Insertar mapa > copia la URL del src del iframe"
          htmlFor="map-url"
        >
          <textarea
            id="map-url"
            value={form.embedURL}
            onChange={handleChange('embedURL')}
            rows={3}
          />
        </FormSection>

        {form.embedURL && (
          <div style={{ marginTop: '0.5rem', borderRadius: 8, overflow: 'hidden' }}>
            <iframe
              title="Preview del mapa"
              src={form.embedURL}
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
        )}

        <FormActions onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
};

export default EditContact;
