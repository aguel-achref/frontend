import { useEffect, useState } from 'react';

import {
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
} from '../../api/beneficiary.api';

const emptyForm = {
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

function Beneficiaries() {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadBeneficiaries = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await getBeneficiaries();

            setBeneficiaries(response.data || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                'Impossible de récupérer les bénéficiaires'
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError('');
            setSuccess('');

            if (editingId) {

                await updateBeneficiary(
                    editingId,
                    form
                );

                setSuccess(
                    'Bénéficiaire modifié avec succès.'
                );

            } else {

                await createBeneficiary(form);

                setSuccess(
                    'Bénéficiaire créé avec succès.'
                );
            }

            resetForm();

            await loadBeneficiaries();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                'Une erreur est survenue'
            );

        } finally {

            setSaving(false);
        }
    };

    const handleEdit = (beneficiary) => {

        setEditingId(beneficiary.id);

        setForm({
            name: beneficiary.name || '',
            address: beneficiary.address || '',
            city: beneficiary.city || '',
            country: beneficiary.country || '',
            iban: beneficiary.iban || '',
            bank_name: beneficiary.bank_name || '',
            swift: beneficiary.swift || '',
            bank_address: beneficiary.bank_address || '',
            intermediary_bank:
                beneficiary.intermediary_bank || '',
            intermediary_swift:
                beneficiary.intermediary_swift || ''
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            'Voulez-vous vraiment supprimer ce bénéficiaire ?'
        );

        if (!confirmed) {
            return;
        }

        try {

            setError('');
            setSuccess('');

            await deleteBeneficiary(id);

            setSuccess(
                'Bénéficiaire supprimé avec succès.'
            );

            await loadBeneficiaries();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                'Impossible de supprimer le bénéficiaire'
            );
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>

            <h1>
                {editingId
                    ? 'Modifier le bénéficiaire'
                    : 'Nouveau bénéficiaire'}
            </h1>

            {error && (
                <div style={{ color: 'red' }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{ color: 'green' }}>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="address"
                    placeholder="Adresse"
                    value={form.address}
                    onChange={handleChange}
                />

                <input
                    name="city"
                    placeholder="Ville"
                    value={form.city}
                    onChange={handleChange}
                />

                <input
                    name="country"
                    placeholder="Pays"
                    value={form.country}
                    onChange={handleChange}
                />

                <input
                    name="iban"
                    placeholder="IBAN"
                    value={form.iban}
                    onChange={handleChange}
                />

                <input
                    name="bank_name"
                    placeholder="Banque"
                    value={form.bank_name}
                    onChange={handleChange}
                />

                <input
                    name="swift"
                    placeholder="SWIFT"
                    value={form.swift}
                    onChange={handleChange}
                />

                <input
                    name="bank_address"
                    placeholder="Adresse banque"
                    value={form.bank_address}
                    onChange={handleChange}
                />

                <input
                    name="intermediary_bank"
                    placeholder="Banque intermédiaire"
                    value={form.intermediary_bank}
                    onChange={handleChange}
                />

                <input
                    name="intermediary_swift"
                    placeholder="SWIFT intermédiaire"
                    value={form.intermediary_swift}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? 'Enregistrement...'
                        : editingId
                            ? 'Modifier'
                            : 'Ajouter'}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Annuler
                    </button>
                )}

            </form>

            <hr />

            <h2>Liste des bénéficiaires</h2>

            <table>

                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Pays</th>
                        <th>IBAN</th>
                        <th>Banque</th>
                        <th>SWIFT</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {beneficiaries.map((beneficiary) => (

                        <tr key={beneficiary.id}>

                            <td>
                                {beneficiary.name}
                            </td>

                            <td>
                                {beneficiary.country}
                            </td>

                            <td>
                                {beneficiary.iban}
                            </td>

                            <td>
                                {beneficiary.bank_name}
                            </td>

                            <td>
                                {beneficiary.swift}
                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        handleEdit(beneficiary)
                                    }
                                >
                                    Modifier
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            beneficiary.id
                                        )
                                    }
                                >
                                    Supprimer
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Beneficiaries;