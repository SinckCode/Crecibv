import React from 'react';

const FormActions = ({ onSave, onCancel, saving, disabled, savingLabel, saveLabel }) => (
  <div className="form-actions">
    {onCancel && (
      <button type="button" className="form-actions__cancel" onClick={onCancel} disabled={saving}>
        Cancelar
      </button>
    )}
    <button
      type="button"
      className="form-actions__save"
      onClick={onSave}
      disabled={saving || disabled}
    >
      {saving ? savingLabel || 'Guardando...' : saveLabel || 'Guardar Cambios'}
    </button>
  </div>
);

export default FormActions;
