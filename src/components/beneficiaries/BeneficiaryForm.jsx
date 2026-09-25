import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

const EMPTY_FORM = {
  name: "",
  address: "",
  city: "",
  country: "",
  iban: "",
  bank_name: "",
  swift: "",
  bank_address: "",
  intermediary_bank: "",
  intermediary_swift: "",
};

const IBAN_LENGTH = 26;

function BeneficiaryForm({
  beneficiary = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (beneficiary) {
      setForm({
        name: beneficiary.name || "",
        address: beneficiary.address || "",
        city: beneficiary.city || "",
        country: beneficiary.country || "",
        iban: beneficiary.iban || "",
        bank_name: beneficiary.bank_name || "",
        swift: beneficiary.swift || "",
        bank_address: beneficiary.bank_address || "",
        intermediary_bank: beneficiary.intermediary_bank || "",
        intermediary_swift: beneficiary.intermediary_swift || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [beneficiary]);

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

  // ---- IBAN boxed input ---------------------------------------------

  const ibanChars = form.iban.padEnd(IBAN_LENGTH, " ").split("");

  const setIban = (value) => {
    setForm((current) => ({
      ...current,
      iban: value,
    }));

    if (errors.iban) {
      setErrors((current) => ({
        ...current,
        iban: "",
      }));
    }
  };

  const handleIbanBoxChange = (index, rawValue) => {
    const chars = form.iban.padEnd(IBAN_LENGTH, " ").split("");

    chars[index] = rawValue.slice(-1).toUpperCase();

    setIban(chars.join("").replace(/\s+$/, ""));

    if (rawValue && index < IBAN_LENGTH - 1) {
      const nextBox = document.getElementById(`iban-box-${index + 1}`);

      if (nextBox) {
        nextBox.focus();
      }
    }
  };

  const handleIbanBoxKeyDown = (index, event) => {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      const previousBox = document.getElementById(`iban-box-${index - 1}`);

      if (previousBox) {
        previousBox.focus();
      }
    }
  };

  const handleIbanPaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\s+/g, "")
      .toUpperCase()
      .slice(0, IBAN_LENGTH);

    setIban(pasted);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Le nom du bénéficiaire est obligatoire.";
    }

    if (!form.country.trim()) {
      newErrors.country = "Le pays est obligatoire.";
    }

    if (!form.iban.trim()) {
      newErrors.iban = "L’IBAN est obligatoire.";
    }

    if (!form.bank_name.trim()) {
      newErrors.bank_name = "Le nom de la banque est obligatoire.";
    }

    if (!form.swift.trim()) {
      newErrors.swift = "Le code SWIFT est obligatoire.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      iban: form.iban.trim().replace(/\s/g, "").toUpperCase(),
      bank_name: form.bank_name.trim(),
      swift: form.swift.trim().toUpperCase(),
      bank_address: form.bank_address.trim(),
      intermediary_bank: form.intermediary_bank.trim(),
      intermediary_swift: form.intermediary_swift.trim().toUpperCase(),
    };

    await onSubmit(payload);
  };

  return (
    <form className="beneficiary-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-section-heading">
          <div>
            <h3>Informations du bénéficiaire</h3>
            <p>Renseignez les informations principales du bénéficiaire.</p>
          </div>
        </div>

        <div className="form-grid-2">
          <Input
            label="Nom du bénéficiaire"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex. ABC INTERNATIONAL"
            error={errors.name}
            required
          />

          <Input
            label="Pays"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Ex. France"
            error={errors.country}
            required
          />

          <Input
            label="Adresse"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Adresse du bénéficiaire"
          />

          <Input
            label="Ville"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Ex. Paris"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <div>
            <h3>Coordonnées bancaires</h3>
            <p>Informations nécessaires pour effectuer le virement.</p>
          </div>
        </div>

        <div className="form-group form-grid-full">
          <label className="form-label">
            IBAN / RIB bénéficiaire{" "}
            <span className="form-required">*</span>
          </label>

          <div className="iban-boxes" onPaste={handleIbanPaste}>
            {Array.from({ length: IBAN_LENGTH }).map((_, index) => (
              <input
                key={index}
                id={`iban-box-${index}`}
                className="iban-box"
                maxLength={1}
                value={ibanChars[index]?.trim() || ""}
                onChange={(event) =>
                  handleIbanBoxChange(index, event.target.value)
                }
                onKeyDown={(event) => handleIbanBoxKeyDown(index, event)}
              />
            ))}
          </div>

          <span className="form-help">
            Saisissez un caractère par case. Le curseur avance
            automatiquement.
          </span>

          {errors.iban && (
            <span className="form-error">{errors.iban}</span>
          )}
        </div>

        <div className="form-grid-3 transfer-form-row">
          <Input
            label="Code SWIFT / BIC"
            name="swift"
            value={form.swift}
            onChange={handleChange}
            placeholder="Ex. BNPAFRPP"
            error={errors.swift}
            required
          />

          <Input
            label="Nom de la banque"
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
            placeholder="Ex. BNP PARIBAS"
            error={errors.bank_name}
            required
          />

          <Input
            label="Adresse de la banque"
            name="bank_address"
            value={form.bank_address}
            onChange={handleChange}
            placeholder="Adresse de la banque"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <div>
            <h3>Banque intermédiaire</h3>
            <p>Facultatif. À compléter uniquement si nécessaire.</p>
          </div>
        </div>

        <div className="form-grid-2">
          <Input
            label="Banque intermédiaire"
            name="intermediary_bank"
            value={form.intermediary_bank}
            onChange={handleChange}
            placeholder="Nom de la banque intermédiaire"
          />

          <Input
            label="SWIFT intermédiaire"
            name="intermediary_swift"
            value={form.intermediary_swift}
            onChange={handleChange}
            placeholder="Ex. ABCDUS33"
          />
        </div>
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
          {beneficiary
            ? "Enregistrer les modifications"
            : "Créer le bénéficiaire"}
        </Button>
      </div>
    </form>
  );
}

export default BeneficiaryForm;