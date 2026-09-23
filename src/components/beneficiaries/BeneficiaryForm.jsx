import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const emptyBeneficiary = {
    name: '',
    address: '',
    city: '',
    country: '',
    iban: '',
    bank_name: '',
    swift: '',
    bank_address: '',
    intermediary_bank: '',
    intermediary_swift: ''
};

function BeneficiaryForm({
    beneficiary = null,
    onSubmit,
    onCancel,
    loading = false
}) {
    const [form, setForm] = useState(emptyBeneficiary);

    useEffect(() => {
        if (beneficiary) {
            setForm({
                name: beneficiary.name || '',
                address: beneficiary.address || '',
                city: beneficiary.city || '',
                country: beneficiary.country || '',
                iban: beneficiary.iban || '',
                bank_name: beneficiary.bank_name || '',
                swift: beneficiary.swift || '',
                bank_address: beneficiary.bank_address || '',
                intermediary_bank: beneficiary.intermediary_bank || '',
                intermediary_swift: beneficiary.intermediary_swift || ''
            });
        } else {
            setForm(emptyBeneficiary);
        }
    }, [beneficiary]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            return;
        }

        onSubmit({
            ...form,
            name: form.name.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
            iban: form.iban.replace(/\s+/g, '').toUpperCase(),
            bank_name: form.bank_name.trim(),
            swift: form.swift.trim().toUpperCase(),
            bank_address: form.bank_address.trim(),
            intermediary_bank: form.intermediary_bank.trim(),
            intermediary_swift: form.intermediary_swift
                .trim()
                .toUpperCase()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="beneficiary-form">
            <div className="form-grid-2">
                <Input
                    label="Nom du bénéficiaire"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nom / raison sociale"
                    required
                />

                <Input
                    label="Pays"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Pays"
                />

                <Input
                    label="Adresse"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Adresse complète"
                />

                <Input
                    label="Ville"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ville"
                />

                <Input
                    label="IBAN / RIB"
                    name="iban"
                    value={form.iban}
                    onChange={handleChange}
                    placeholder="TN..."
                    className="form-grid-full"
                />

                <Input
                    label="Banque bénéficiaire"
                    name="bank_name"
                    value={form.bank_name}
                    onChange={handleChange}
                    placeholder="Nom de la banque"
                />

                <Input
                    label="SWIFT / BIC"
                    name="swift"
                    value={form.swift}
                    onChange={handleChange}
                    placeholder="XXXXXXXX"
                />

                <Input
                    label="Adresse de la banque"
                    name="bank_address"
                    value={form.bank_address}
                    onChange={handleChange}
                    placeholder="Adresse de la banque"
                />

                <Input
                    label="Banque intermédiaire"
                    name="intermediary_bank"
                    value={form.intermediary_bank}
                    onChange={handleChange}
                    placeholder="Optionnel"
                />

                <Input
                    label="SWIFT intermédiaire"
                    name="intermediary_swift"
                    value={form.intermediary_swift}
                    onChange={handleChange}
                    placeholder="Optionnel"
                />
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

                <Button
                    type="submit"
                    loading={loading}
                >
                    {beneficiary
                        ? 'Enregistrer les modifications'
                        : 'Ajouter le bénéficiaire'}
                </Button>
            </div>
        </form>
    );
}

export default BeneficiaryForm;