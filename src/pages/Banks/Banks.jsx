import { useEffect, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';

import BankForm from '../../components/banks/BankForm';
import BankTable from '../../components/banks/BankTable';

import {
    getBanks,
    createBank,
    updateBank,
    deleteBank
} from '../../api/bank.api';

function Banks() {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingBank, setEditingBank] = useState(null);

    const [toast, setToast] = useState(null);

    const loadBanks = async () => {
        try {
            setLoading(true);

            const response = await getBanks();

            if (response.success) {
                setBanks(response.data || []);
            }
        } catch (error) {
            console.error(error);

            setToast({
                type: 'error',
                message:
                    error.response?.data?.error ||
                    'Impossible de charger les banques.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBanks();
    }, []);

    const openCreate = () => {
        setEditingBank(null);
        setModalOpen(true);
    };

    const openEdit = (bank) => {
        setEditingBank(bank);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (!saving) {
            setModalOpen(false);
            setEditingBank(null);
        }
    };

    const handleSubmit = async (data) => {
        try {
            setSaving(true);

            if (editingBank) {
                await updateBank(editingBank.id, data);

                setToast({
                    type: 'success',
                    message: 'Banque modifiée avec succès.'
                });
            } else {
                await createBank(data);

                setToast({
                    type: 'success',
                    message: 'Banque ajoutée avec succès.'
                });
            }

            setModalOpen(false);
            setEditingBank(null);

            await loadBanks();
        } catch (error) {
            console.error(error);

            setToast({
                type: 'error',
                message:
                    error.response?.data?.error ||
                    'Une erreur est survenue.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (bank) => {
        const confirmed = window.confirm(
            `Supprimer la banque "${bank.name}" ?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteBank(bank.id);

            setToast({
                type: 'success',
                message: 'Banque supprimée.'
            });

            await loadBanks();
        } catch (error) {
            console.error(error);

            setToast({
                type: 'error',
                message:
                    error.response?.data?.error ||
                    'Impossible de supprimer la banque.'
            });
        }
    };

    return (
        <div className="page banks-page">
            <PageHeader
                title="Banques"
                description="Gérez les banques émettrices et leurs modèles de formulaires."
                actions={
                    <Button onClick={openCreate}>
                        + Nouvelle banque
                    </Button>
                }
            />

            <div className="page-stats">
                <div className="stat-card">
                    <span className="stat-label">
                        Banques
                    </span>

                    <strong className="stat-value">
                        {banks.length}
                    </strong>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Banques actives
                    </span>

                    <strong className="stat-value">
                        {
                            banks.filter(
                                (bank) =>
                                    Boolean(bank.is_active)
                            ).length
                        }
                    </strong>
                </div>
            </div>

            <Card
                title="Banques disponibles"
                description="Ces banques peuvent être utilisées pour les virements."
            >
                <BankTable
                    banks={banks}
                    loading={loading}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            </Card>

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={
                    editingBank
                        ? 'Modifier la banque'
                        : 'Nouvelle banque'
                }
                description="Configurez les informations de la banque."
            >
                <BankForm
                    bank={editingBank}
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

export default Banks;