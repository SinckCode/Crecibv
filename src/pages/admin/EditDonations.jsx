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
    beneficiaryName: '',
    beneficiaryAddress: '',
    bankName: '',
    clabe: '',
    bankLogoURL: '',
    donationImageURL: '',
    primaryCtaText: '',
    primaryCtaURL: '',
    whatsappNumber: '',
    whatsappMessage: '',
    highlightNotice: '',
    suggestedAmounts: [],
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
        beneficiaryName: settings.donations.beneficiaryName,
        beneficiaryAddress: settings.donations.beneficiaryAddress,
        bankName: settings.donations.bankName,
        clabe: settings.donations.clabe,
        bankLogoURL: settings.donations.bankLogoURL,
        donationImageURL: settings.donations.donationImageURL,
        primaryCtaText: settings.donations.primaryCtaText || '',
        primaryCtaURL: settings.donations.primaryCtaURL || '',
        whatsappNumber: settings.donations.whatsappNumber || '',
        whatsappMessage: settings.donations.whatsappMessage || '',
        highlightNotice: settings.donations.highlightNotice || '',
        suggestedAmounts: settings.donations.suggestedAmounts || [],
      });
    }
  }, [loading, settings]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleAmountChange = (index, field) => (e) => {
    const next = form.suggestedAmounts.map((item, i) =>
      i === index ? { ...item, [field]: e.target.value } : item,
    );
    setForm({ ...form, suggestedAmounts: next });
    setMessage({ type: '', text: '' });
  };

  const addAmount = () => {
    setForm({ ...form, suggestedAmounts: [...form.suggestedAmounts, { amount: '', impact: '' }] });
  };

  const removeAmount = (index) => () => {
    setForm({ ...form, suggestedAmounts: form.suggestedAmounts.filter((_, i) => i !== index) });
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

    if (form.primaryCtaURL && !/^https:\/\//.test(form.primaryCtaURL)) {
      setMessage({ type: 'error', text: 'El enlace de donacion debe empezar con https://' });
      return;
    }

    if (form.whatsappNumber && !/^\d{10,15}$/.test(form.whatsappNumber)) {
      setMessage({
        type: 'error',
        text: 'El numero de WhatsApp va con lada de pais y sin signos, ej. 524772017851.',
      });
      return;
    }

    // Firestore guarda los montos como numero; las filas vacias se descartan
    const suggestedAmounts = form.suggestedAmounts
      .filter((item) => String(item.amount).trim() !== '')
      .map((item) => ({ amount: Number(item.amount), impact: item.impact }));

    if (suggestedAmounts.some((item) => !Number.isFinite(item.amount) || item.amount <= 0)) {
      setMessage({ type: 'error', text: 'Los montos sugeridos deben ser numeros mayores a cero.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await setDoc(
        doc(db, 'content', 'siteSettings'),
        { donations: { ...form, suggestedAmounts } },
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
          label="Texto introductorio"
          hint="Encabezado que aparece antes de los datos bancarios"
          htmlFor="don-awareness"
        >
          <input
            id="don-awareness"
            type="text"
            value={form.awarenessMessage}
            onChange={handleChange('awarenessMessage')}
          />
        </FormSection>

        <FormSection label="Texto adicional" hint="Segundo parrafo (opcional)" htmlFor="don-cta">
          <textarea
            id="don-cta"
            value={form.callToAction}
            onChange={handleChange('callToAction')}
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Donativo en Linea</h3>

        <FormSection
          label="Texto del boton principal"
          hint="Lo que dice el boton rosa, ej. Donar ahora"
          htmlFor="don-cta-text"
        >
          <input
            id="don-cta-text"
            type="text"
            value={form.primaryCtaText}
            onChange={handleChange('primaryCtaText')}
          />
        </FormSection>

        <FormSection
          label="Enlace de donacion"
          hint="A donde lleva el boton: GoFundMe u otra plataforma. Dejalo vacio para ocultar el boton."
          htmlFor="don-cta-url"
        >
          <input
            id="don-cta-url"
            type="url"
            placeholder="https://gofund.me/..."
            value={form.primaryCtaURL}
            onChange={handleChange('primaryCtaURL')}
          />
        </FormSection>

        <FormSection
          label="Numero de WhatsApp"
          hint="Con lada de pais y sin signos, ej. 524772017851"
          htmlFor="don-wa-number"
        >
          <input
            id="don-wa-number"
            type="text"
            value={form.whatsappNumber}
            onChange={handleChange('whatsappNumber')}
          />
        </FormSection>

        <FormSection
          label="Mensaje precargado de WhatsApp"
          hint="Texto con el que se abre la conversacion"
          htmlFor="don-wa-msg"
        >
          <input
            id="don-wa-msg"
            type="text"
            value={form.whatsappMessage}
            onChange={handleChange('whatsappMessage')}
          />
        </FormSection>

        <FormSection
          label="Mensaje destacado"
          hint="Aparece en el recuadro rosa arriba de la seccion. No incluyas aqui temas fiscales ni de deducibilidad: eso se trata directo con cada donante."
          htmlFor="don-highlight"
        >
          <textarea
            id="don-highlight"
            value={form.highlightNotice}
            onChange={handleChange('highlightNotice')}
          />
        </FormSection>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Montos Sugeridos</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
          Cada monto con lo que financia en concreto. Decir &quot;$500 = un mes de traslados&quot;
          funciona mejor que dejar la cantidad abierta.
        </p>

        {form.suggestedAmounts.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              marginBottom: '1rem',
            }}
          >
            <div style={{ flex: '0 0 7rem' }}>
              <FormSection label="Monto" htmlFor={`don-amount-${index}`}>
                <input
                  id={`don-amount-${index}`}
                  type="number"
                  min="1"
                  value={item.amount}
                  onChange={handleAmountChange(index, 'amount')}
                />
              </FormSection>
            </div>
            <div style={{ flex: 1 }}>
              <FormSection label="Que financia" htmlFor={`don-impact-${index}`}>
                <input
                  id={`don-impact-${index}`}
                  type="text"
                  value={item.impact}
                  onChange={handleAmountChange(index, 'impact')}
                />
              </FormSection>
            </div>
            <button
              type="button"
              onClick={removeAmount(index)}
              style={{
                marginBottom: '1rem',
                padding: '0.5rem 0.9rem',
                background: 'transparent',
                border: '1px solid #e53935',
                borderRadius: 8,
                color: '#e53935',
                cursor: 'pointer',
              }}
            >
              Quitar
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addAmount}
          style={{
            padding: '0.6rem 1.2rem',
            background: 'transparent',
            border: '1px solid #7b1fa2',
            borderRadius: 8,
            color: '#7b1fa2',
            cursor: 'pointer',
          }}
        >
          Agregar monto
        </button>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Datos del Beneficiario</h3>

        <FormSection
          label="Nombre del beneficiario"
          hint="Nombre completo de la organizacion que recibe el donativo"
          htmlFor="don-beneficiary"
        >
          <input
            id="don-beneficiary"
            type="text"
            value={form.beneficiaryName}
            onChange={handleChange('beneficiaryName')}
          />
        </FormSection>

        <FormSection
          label="Direccion del beneficiario"
          hint="Direccion completa incluyendo codigo postal"
          htmlFor="don-address"
        >
          <textarea
            id="don-address"
            value={form.beneficiaryAddress}
            onChange={handleChange('beneficiaryAddress')}
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
