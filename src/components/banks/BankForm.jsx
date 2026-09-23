import { useEffect, useState } from 'react';

import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const emptyBank = {
    code: '',
    name: '',
    account: '',
    template: 'GENERIC',
    form_number: ''
};

function BankForm({
    bank = null,
    onSubmit,
    onCancel,
    loading = false
}) {
    const [form, setForm] = useState(emptyBank);

    useEffect(() => {
        if (bank) {
            setForm({
                code: bank.code || '',
                name: bank.name || '',
                account: bank.account || '',
                template: bank.template || 'GENERIC',
                form_number: bank.form_number || ''
            });
        } else {
            setForm(emptyBank);
        }
    }, [bank]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.code.trim() || !form.name.trim()) {
            return;
        }

        onSubmit({
            ...form,
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            account: form.account.trim(),
            form_number: form.form_number.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
                <Input
                    label="Code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="BIAT"
                    required
                />

                <Input
                    label="Nom de la banque"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nom de la banque"
                    required
                />

                <Input
                    label="Compte bancaire"
                    name="account"
                    value={form.account}
                    onChange={handleChange}
                    placeholder="Compte de débit"
                />

                <Select
                    label="Template"
                    name="template"
                    value={form.template}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'GENERIC',
                            label: 'Générique'
                        },
                        {
                            value: 'BIAT',
                            label: 'BIAT'
                        },
                        {
                            value: 'ATTIJARI',
                            label: 'Attijari'
                        }
                    ]}
                />

                <Input
                    label="Numéro de formulaire"
                    name="form_number"
                    value={form.form_number}
                    onChange={handleChange}
                    placeholder="93 / 140"
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
                    {bank
                        ? 'Enregistrer'
                        : 'Ajouter la banque'}
                </Button>
            </div>
        </form>
    );
}

export default BankForm;