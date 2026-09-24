import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

import { getBanks } from '../../api/bank.api';
import {
    getBeneficiaries,
} from '../../api/beneficiary.api';
import {
    getTransfers,
} from '../../api/transfer.api';

function Dashboard() {
    const [banks, setBanks] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [transfers, setTransfers] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [
                    banksResponse,
                    beneficiariesResponse,
                    transfersResponse,
                ] = await Promise.all([
                    getBanks(),
                    getBeneficiaries(),
                    getTransfers(),
                ]);

                if (banksResponse.success) {
                    setBanks(banksResponse.data || []);
                }

                if (beneficiariesResponse.success) {
                    setBeneficiaries(
                        beneficiariesResponse.data || []
                    );
                }

                if (transfersResponse.success) {
                    setTransfers(
                        transfersResponse.data || []
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const activeBanks = banks.filter(
        (bank) => Boolean(bank.is_active)
    );

    const totalAmount = useMemo(() => {
        return transfers.reduce(
            (total, transfer) =>
                total + Number(transfer.amount || 0),
            0
        );
    }, [transfers]);

    const currencyTotals = useMemo(() => {
        const totals = {};

        transfers.forEach((transfer) => {
            const currency = transfer.currency || 'N/A';

            totals[currency] =
                (totals[currency] || 0) +
                Number(transfer.amount || 0);
        });

        return totals;
    }, [transfers]);

    const recentTransfers = [...transfers]
        .sort(
            (a, b) =>
                new Date(b.created_at || b.transfer_date) -
                new Date(a.created_at || a.transfer_date)
        )
        .slice(0, 5);

    return (
        <div className="page dashboard-page">
            <PageHeader
                title="Tableau de bord"
                description="Vue d'ensemble de votre gestion des virements internationaux."
                actions={
                    <Button
                        onClick={() => {
                            window.location.href =
                                '/transfers';
                        }}
                    >
                        + Nouveau virement
                    </Button>
                }
            />

            {loading ? (
                <Card>
                    <div className="page-loading">
                        <div className="loading-spinner" />
                        <span>
                            Chargement du tableau de bord...
                        </span>
                    </div>
                </Card>
            ) : (
                <>
                    <div className="dashboard-stats">
                        <div className="dashboard-stat">
                            <span>Virements</span>
                            <strong>
                                {transfers.length}
                            </strong>
                            <small>
                                ordres enregistrés
                            </small>
                        </div>

                        <div className="dashboard-stat">
                            <span>Bénéficiaires</span>
                            <strong>
                                {beneficiaries.length}
                            </strong>
                            <small>
                                bénéficiaires enregistrés
                            </small>
                        </div>

                        <div className="dashboard-stat">
                            <span>Banques actives</span>
                            <strong>
                                {activeBanks.length}
                            </strong>
                            <small>
                                banques disponibles
                            </small>
                        </div>

                        <div className="dashboard-stat">
                            <span>Montant total</span>
                            <strong>
                                {totalAmount.toLocaleString(
                                    'fr-FR',
                                    {
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </strong>
                            <small>
                                toutes devises confondues
                            </small>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <Card
                            title="Derniers virements"
                            description="Les dernières opérations enregistrées."
                        >
                            {recentTransfers.length === 0 ? (
                                <div className="dashboard-empty">
                                    Aucun virement enregistré.
                                </div>
                            ) : (
                                <div className="recent-transfer-list">
                                    {recentTransfers.map(
                                        (transfer) => (
                                            <div
                                                className="recent-transfer"
                                                key={transfer.id}
                                            >
                                                <div>
                                                    <strong>
                                                        {transfer.reference}
                                                    </strong>

                                                    <span>
                                                        {transfer.beneficiary_name ||
                                                            'Bénéficiaire'}
                                                    </span>
                                                </div>

                                                <div className="recent-transfer-right">
                                                    <strong>
                                                        {Number(
                                                            transfer.amount ||
                                                                0
                                                        ).toLocaleString(
                                                            'fr-FR',
                                                            {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}{' '}
                                                        {transfer.currency}
                                                    </strong>

                                                    <span>
                                                        {
                                                            transfer.transfer_date
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </Card>

                        <Card
                            title="Répartition par devise"
                            description="Montants cumulés des virements."
                        >
                            <div className="currency-list">
                                {Object.keys(currencyTotals)
                                    .length === 0 ? (
                                    <div className="dashboard-empty">
                                        Aucune donnée disponible.
                                    </div>
                                ) : (
                                    Object.entries(
                                        currencyTotals
                                    ).map(
                                        ([
                                            currency,
                                            amount,
                                        ]) => (
                                            <div
                                                className="currency-item"
                                                key={currency}
                                            >
                                                <Badge
                                                    variant="neutral"
                                                >
                                                    {currency}
                                                </Badge>

                                                <strong>
                                                    {amount.toLocaleString(
                                                        'fr-FR',
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </strong>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </Card>
                    </div>

                    <Card
                        title="Banques disponibles"
                        description="Configuration actuelle des banques émettrices."
                    >
                        <div className="dashboard-bank-list">
                            {banks.map((bank) => (
                                <div
                                    className="dashboard-bank"
                                    key={bank.id}
                                >
                                    <div className="dashboard-bank-avatar">
                                        {bank.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {bank.name}
                                        </strong>

                                        <span>
                                            {bank.account ||
                                                'Compte non renseigné'}
                                        </span>
                                    </div>

                                    <Badge
                                        variant={
                                            bank.is_active
                                                ? 'success'
                                                : 'neutral'
                                        }
                                    >
                                        {bank.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

export default Dashboard;