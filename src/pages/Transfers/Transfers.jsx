import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    getBanks,
} from '../../api/bank.api';

import {
    getBeneficiaries,
} from '../../api/beneficiary.api';

import {
    getTransfers,
    createTransfer,
    deleteTransfer,
    getOneTransfer,
} from '../../api/transfer.api';

import PageHeader from '../../components/layout/PageHeader';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';

import TransferForm from '../../components/transfers/TransferForm';
import TransferFilters from '../../components/transfers/TransferFilters';
import TransferSummary from '../../components/transfers/TransferSummary';
import TransferTable from '../../components/transfers/TransferTable';

function Transfers() {
    const [banks, setBanks] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [transfers, setTransfers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        bank_id: '',
        search: '',
    });

    const [selectedTransfer, setSelectedTransfer] =
        useState(null);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [showDetails, setShowDetails] =
        useState(false);

    const [toast, setToast] = useState({
        message: '',
        type: 'success',
    });

    const showToast = useCallback(
        (message, type = 'success') => {
            setToast({
                message,
                type,
            });

            setTimeout(() => {
                setToast({
                    message: '',
                    type: 'success',
                });
            }, 4000);
        },
        []
    );

    const loadInitialData = useCallback(
        async () => {
            try {
                setLoading(true);

                const [
                    banksResponse,
                    beneficiariesResponse,
                ] = await Promise.all([
                    getBanks(),
                    getBeneficiaries(),
                ]);

                if (banksResponse?.success) {
                    setBanks(
                        banksResponse.data || []
                    );
                }

                if (
                    beneficiariesResponse?.success
                ) {
                    setBeneficiaries(
                        beneficiariesResponse.data ||
                            []
                    );
                }
            } catch (error) {
                console.error(
                    'Error loading transfer data:',
                    error
                );

                showToast(
                    'Impossible de charger les données.',
                    'error'
                );
            } finally {
                setLoading(false);
            }
        },
        [showToast]
    );

    const loadTransfers =
        useCallback(async () => {
            try {
                const params = {};

                if (filters.year) {
                    params.year =
                        filters.year;
                }

                if (filters.bank_id) {
                    params.bank_id =
                        filters.bank_id;
                }

                if (filters.search?.trim()) {
                    params.search =
                        filters.search.trim();
                }

                const response =
                    await getTransfers(params);

                if (response?.success) {
                    setTransfers(
                        response.data || []
                    );
                } else {
                    setTransfers([]);
                }
            } catch (error) {
                console.error(
                    'Error loading transfers:',
                    error
                );

                showToast(
                    'Impossible de charger l’historique.',
                    'error'
                );
            }
        }, [filters, showToast]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    useEffect(() => {
        loadTransfers();
    }, [loadTransfers]);

    const handleCreateTransfer = async (
        transferData
    ) => {
        try {
            setCreating(true);

            const response =
                await createTransfer(
                    transferData
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        'Impossible de créer le virement.'
                );
            }

            showToast(
                `Virement ${response.data?.reference || ''} créé avec succès.`
            );

            setShowCreateForm(false);

            await loadTransfers();
        } catch (error) {
            console.error(
                'Error creating transfer:',
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Impossible de créer le virement.';

            showToast(
                message,
                'error'
            );
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteTransfer = async (
        transfer
    ) => {
        const confirmed = window.confirm(
            `Voulez-vous vraiment supprimer le virement ${transfer.reference || ''} ?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            const response =
                await deleteTransfer(
                    transfer.id
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        'Impossible de supprimer le virement.'
                );
            }

            showToast(
                'Virement supprimé avec succès.'
            );

            await loadTransfers();
        } catch (error) {
            console.error(
                'Error deleting transfer:',
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Impossible de supprimer le virement.';

            showToast(
                message,
                'error'
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleViewTransfer = async (
        transfer
    ) => {
        try {
            const response =
                await getOneTransfer(
                    transfer.id
                );

            if (response?.success) {
                setSelectedTransfer(
                    response.data
                );
            } else {
                setSelectedTransfer(
                    transfer
                );
            }
        } catch (error) {
            console.error(
                'Error loading transfer:',
                error
            );

            setSelectedTransfer(
                transfer
            );
        }

        setShowDetails(true);
    };

    const handleResetFilters = () => {
        setFilters({
            year: new Date().getFullYear(),
            bank_id: '',
            search: '',
        });
    };

    const selectedBank = useMemo(() => {
        if (!selectedTransfer) {
            return null;
        }

        return banks.find(
            (bank) =>
                String(bank.id) ===
                String(
                    selectedTransfer.bank_id
                )
        );
    }, [
        banks,
        selectedTransfer,
    ]);

    const selectedBeneficiary =
        useMemo(() => {
            if (!selectedTransfer) {
                return null;
            }

            return beneficiaries.find(
                (beneficiary) =>
                    String(
                        beneficiary.id
                    ) ===
                    String(
                        selectedTransfer.beneficiary_id
                    )
            );
        }, [
            beneficiaries,
            selectedTransfer,
        ]);

    return (
        <div className="page transfers-page">
            <PageHeader
                title="Virements"
                description="Créez et consultez vos virements internationaux."
                action={
                    <Button
                        variant="primary"
                        icon="+"
                        onClick={() =>
                            setShowCreateForm(
                                true
                            )
                        }
                    >
                        Nouveau virement
                    </Button>
                }
            />

            <div className="transfer-page-stats">
                <div className="transfer-mini-stat">
                    <span>
                        Total affiché
                    </span>

                    <strong>
                        {transfers.length}
                    </strong>
                </div>

                <div className="transfer-mini-stat">
                    <span>
                        Banques actives
                    </span>

                    <strong>
                        {
                            banks.filter(
                                (bank) =>
                                    bank.is_active ===
                                        true ||
                                    bank.is_active ===
                                        1 ||
                                    bank.is_active ===
                                        undefined
                            ).length
                        }
                    </strong>
                </div>

                <div className="transfer-mini-stat">
                    <span>
                        Bénéficiaires
                    </span>

                    <strong>
                        {beneficiaries.length}
                    </strong>
                </div>
            </div>

            <TransferFilters
                filters={filters}
                onChange={setFilters}
                onReset={
                    handleResetFilters
                }
                banks={banks}
            />

            <Card
                title="Historique des virements"
                description="Consultez les opérations enregistrées."
                padding={false}
            >
                <TransferTable
                    transfers={transfers}
                    loading={loading}
                    onDelete={
                        handleDeleteTransfer
                    }
                    onView={
                        handleViewTransfer
                    }
                />
            </Card>

            <Modal
                open={showCreateForm}
                onClose={() => {
                    if (!creating) {
                        setShowCreateForm(
                            false
                        );
                    }
                }}
                title="Nouveau virement"
                description="Renseignez les informations du virement."
                size="large"
            >
                <TransferForm
                    banks={banks}
                    beneficiaries={
                        beneficiaries
                    }
                    onSubmit={
                        handleCreateTransfer
                    }
                    loading={creating}
                />
            </Modal>

            <Modal
                open={showDetails}
                onClose={() =>
                    setShowDetails(false)
                }
                title={
                    selectedTransfer
                        ? `Virement ${selectedTransfer.reference || ''}`
                        : 'Détail du virement'
                }
                description="Informations complètes du virement."
                size="large"
            >
                {selectedTransfer && (
                    <TransferSummary
                        transfer={
                            selectedTransfer
                        }
                        bank={selectedBank}
                        beneficiary={
                            selectedBeneficiary
                        }
                    />
                )}
            </Modal>

            {deleting && (
                <div className="operation-overlay">
                    <div className="operation-loader">
                        <div className="loading-spinner" />

                        <span>
                            Suppression...
                        </span>
                    </div>
                </div>
            )}

            {toast.message && (
                <div className="toast-container">
                    <Toast
                        message={
                            toast.message
                        }
                        type={toast.type}
                        onClose={() =>
                            setToast({
                                message: '',
                                type: 'success',
                            })
                        }
                    />
                </div>
            )}
        </div>
    );
}

export default Transfers;