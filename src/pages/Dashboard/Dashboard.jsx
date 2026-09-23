import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { getBanks } from '../../api/bank.api';
import { getBeneficiaries } from '../../api/beneficiary.api';
import { getTransfers } from '../../api/transfer.api';

function Dashboard() {
    const [stats, setStats] = useState({
        transfers: 0,
        beneficiaries: 0,
        banks: 0
    });

    const [recentTransfers, setRecentTransfers] =
        useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);

                const [
                    transfersResponse,
                    beneficiariesResponse,
                    banksResponse
                ] = await Promise.all([
                    getTransfers(),
                    getBeneficiaries(),
                    getBanks()
                ]);

                const transfers =
                    transfersResponse.data || [];

                setStats({
                    transfers: transfers.length,
                    beneficiaries:
                        beneficiariesResponse.data?.length || 0,
                    banks: banksResponse.data?.length || 0
                });

                setRecentTransfers(
                    transfers.slice(0, 5)
                );
            } catch (error) {
                console.error(
                    'Dashboard loading error:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="page dashboard-page">
            <PageHeader
                title="Tableau de bord"
                description="Vue d'ensemble de votre gestion des virements."
                actions={
                    <Link
                        to="/transfers"
                        className="button-link"
                    >
                        <Button>
                            + Nouveau virement
                        </Button>
                    </Link>
                }
            />

            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        ↗
                    </span>

                    <div>
                        <span className="stat-label">
                            Virements
                        </span>

                        <strong>
                            {loading
                                ? '...'
                                : stats.transfers}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        👤
                    </span>

                    <div>
                        <span className="stat-label">
                            Bénéficiaires
                        </span>

                        <strong>
                            {loading
                                ? '...'
                                : stats.beneficiaries}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-icon">
                        🏦
                    </span>

                    <div>
                        <span className="stat-label">
                            Banques
                        </span>

                        <strong>
                            {loading
                                ? '...'
                                : stats.banks}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <Card
                    title="Accès rapides"
                    description="Les opérations les plus utilisées."
                >
                    <div className="quick-actions">
                        <Link to="/transfers">
                            <div className="quick-action">
                                <span>↗</span>
                                <div>
                                    <strong>
                                        Nouveau virement
                                    </strong>

                                    <small>
                                        Créer un virement
                                        bancaire
                                    </small>
                                </div>
                            </div>
                        </Link>

                        <Link to="/beneficiaries">
                            <div className="quick-action">
                                <span>👤</span>
                                <div>
                                    <strong>
                                        Bénéficiaires
                                    </strong>

                                    <small>
                                        Gérer les
                                        bénéficiaires
                                    </small>
                                </div>
                            </div>
                        </Link>

                        <Link to="/banks">
                            <div className="quick-action">
                                <span>🏦</span>
                                <div>
                                    <strong>
                                        Banques
                                    </strong>

                                    <small>
                                        Gérer les banques
                                    </small>
                                </div>
                            </div>
                        </Link>

                        <Link to="/settings">
                            <div className="quick-action">
                                <span>⚙</span>
                                <div>
                                    <strong>
                                        Paramètres
                                    </strong>

                                    <small>
                                        Configuration
                                    </small>
                                </div>
                            </div>
                        </Link>
                    </div>
                </Card>

                <Card
                    title="Derniers virements"
                    description="Les opérations récemment enregistrées."
                >
                    {recentTransfers.length === 0 ? (
                        <div className="dashboard-empty">
                            Aucun virement enregistré.
                        </div>
                    ) : (
                        <div className="recent-transfers">
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
                                                {
                                                    transfer.beneficiary_name
                                                }
                                            </span>
                                        </div>

                                        <strong>
                                            {Number(
                                                transfer.amount ||
                                                    0
                                            ).toLocaleString(
                                                'fr-FR',
                                                {
                                                    minimumFractionDigits: 2
                                                }
                                            )}{' '}
                                            {
                                                transfer.currency
                                            }
                                        </strong>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default Dashboard;