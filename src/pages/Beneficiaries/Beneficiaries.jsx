import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';

import BeneficiaryForm from '../../components/beneficiaries/BeneficiaryForm';
import BeneficiaryTable from '../../components/beneficiaries/BeneficiaryTable';

import {
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
} from '../../api/beneficiary.api';

function Beneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({
            message,
            type,
        });
    };

    const loadBeneficiaries = async () => {
        try {
            setLoading(true);

            const response = await getBeneficiaries();

            if (response.success) {
                setBeneficiaries(response.data || []);
            } else {
                showToast(
                    response.error || 'Impossible de charger les bénéficiaires.',
                    'error'
                );
            }
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.error ||
                    'Erreur lors du chargement des bénéficiaires.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const filteredBeneficiaries = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return beneficiaries;
        }

        return beneficiaries.filter((beneficiary) => {
            return [
                beneficiary.name,
                beneficiary.country,
                beneficiary.city,
                beneficiary.bank_name,
                beneficiary.iban,
                beneficiary.swift,
            ]
                .filter(Boolean)
                .some((field) =>
                    String(field)
                        .toLowerCase()
                        .includes(value)
                );
        });
    }, [beneficiaries, search]);

    const openCreateModal = () => {
        setSelectedBeneficiary(null);
        setModalOpen(true);
    };

    const openEditModal = (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setModalOpen(false);
        setSelectedBeneficiary(null);
    };

    const handleSubmit = async (payload) => {
        try {
            setSaving(true);

            let response;

            if (selectedBeneficiary) {
                response = await updateBeneficiary(
                    selectedBeneficiary.id,
                    payload
                );
            } else {
                response = await createBeneficiary(payload);
            }

            if (!response.success) {
                showToast(
                    response.error ||
                        'Une erreur est survenue.',
                    'error'
                );

                return;
            }

            await loadBeneficiaries();

            setModalOpen(false);
            setSelectedBeneficiary(null);

            showToast(
                selectedBeneficiary
                    ? 'Bénéficiaire modifié avec succès.'
                    : 'Bénéficiaire créé avec succès.',
                'success'
            );
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.error ||
                    'Impossible d’enregistrer le bénéficiaire.',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (beneficiary) => {
        const confirmed = window.confirm(
            `Voulez-vous vraiment supprimer le bénéficiaire "${beneficiary.name}" ?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await deleteBeneficiary(
                beneficiary.id
            );

            if (!response.success) {
                showToast(
                    response.error ||
                        'Impossible de supprimer le bénéficiaire.',
                    'error'
                );

                return;
            }

            await loadBeneficiaries();

            showToast(
                'Bénéficiaire supprimé avec succès.',
                'success'
            );
        } catch (error) {
            console.error(error);

            showToast(
                error.response?.data?.error ||
                    'Erreur lors de la suppression du bénéficiaire.',
                'error'
            );
        }
    };

    return (
        <div className="page beneficiaries-page">
            <PageHeader
                title="Bénéficiaires"
                description="Gérez les bénéficiaires utilisés pour vos virements internationaux."
                actions={
                    <Button onClick={openCreateModal}>
                        + Nouveau bénéficiaire
                    </Button>
                }
            />

            <div className="beneficiary-stats">
                <div className="beneficiary-stat-card">
                    <span>Total bénéficiaires</span>
                    <strong>{beneficiaries.length}</strong>
                </div>

                <div className="beneficiary-stat-card">
                    <span>Résultats affichés</span>
                    <strong>
                        {filteredBeneficiaries.length}
                    </strong>
                </div>
            </div>

            <Card
                title="Liste des bénéficiaires"
                description="Recherchez et gérez vos bénéficiaires."
            >
                <div className="beneficiary-toolbar">
                    <Input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Rechercher un nom, IBAN, banque..."
                    />

                    {search && (
                        <Button
                            variant="secondary"
                            onClick={() => setSearch('')}
                        >
                            Réinitialiser
                        </Button>
                    )}
                </div>

                <BeneficiaryTable
                    beneficiaries={filteredBeneficiaries}
                    loading={loading}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                />
            </Card>

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={
                    selectedBeneficiary
                        ? 'Modifier le bénéficiaire'
                        : 'Nouveau bénéficiaire'
                }
                description={
                    selectedBeneficiary
                        ? 'Modifiez les informations du bénéficiaire.'
                        : 'Ajoutez un nouveau bénéficiaire bancaire.'
                }
                size="large"
            >
                <BeneficiaryForm
                    beneficiary={selectedBeneficiary}
                    onSubmit={handleSubmit}
                    onCancel={closeModal}
                    loading={saving}
                />
            </Modal>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default Beneficiaries;