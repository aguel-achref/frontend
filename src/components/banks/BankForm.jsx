import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const EMPTY_FORM = {
  code: "",
  name: "",
  account: "",
  template: "GENERIC",
  form_number: "",
  is_active: true,
};

function BankForm({ bank = null, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bank) {
      setForm({
        code: bank.code || "",
        name: bank.name || "",
        account: bank.account || "",
        template: bank.template || "GENERIC",
        form_number: bank.form_number || "",
        is_active:
          bank.is_active === undefined ? true : Boolean(bank.is_active),
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [bank]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const handleActiveChange = (event) => {
    setForm((current) => ({
      ...current,
      is_active: event.target.checked,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.code.trim()) {
      nextErrors.code = "Le code est obligatoire.";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Le nom de la banque est obligatoire.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      account: form.account.trim(),
      template: form.template,
      form_number: form.form_number.trim(),
      is_active: Boolean(form.is_active),
    });
  };

  return (
    <form className="bank-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-heading">
          <h3>Informations de la banque</h3>
          <p>Configurez la banque émettrice utilisée pour les virements.</p>
        </div>

        <div className="form-grid-2">
          <Input
            label="Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Ex. BIAT"
            error={errors.code}
            required
          />

          <Input
            label="Nom de la banque"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex. Banque Internationale Arabe de Tunisie"
            error={errors.name}
            required
          />

          <Input
            label="Compte"
            name="account"
            value={form.account}
            onChange={handleChange}
            placeholder="Numéro de compte"
          />

          <Select
            label="Modèle de formulaire"
            name="template"
            value={form.template}
            onChange={handleChange}
            options={[
              {
                value: "GENERIC",
                label: "Générique",
              },
              {
                value: "BIAT",
                label: "BIAT",
              },
              {
                value: "ATTIJARI",
                label: "Attijari",
              },
            ]}
          />

          <Input
            label="Numéro de formulaire"
            name="form_number"
            value={form.form_number}
            onChange={handleChange}
            placeholder="Ex. TF-001"
          />
        </div>

        <label className="bank-active-toggle">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleActiveChange}
          />

          <span>
            <strong>Banque active</strong>
            <small>
              Cette banque peut être sélectionnée pour un nouveau virement.
            </small>
          </span>
        </label>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button type="submit" loading={loading} disabled={loading}>
          {bank ? "Enregistrer les modifications" : "Créer la banque"}
        </Button>
      </div>
    </form>
  );
}

export default BankForm;
