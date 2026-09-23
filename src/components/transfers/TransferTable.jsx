import Button from '../ui/Button';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

function TransferTable({
    transfers = [],
    loading = false,
    onDelete,
    onView,
}) {
    const formatAmount = (
        amount,
        currency
    ) => {
        if (
            amount === null ||
            amount === undefined
        ) {
            return '—';
        }

        return `${Number(
            amount
        ).toLocaleString('fr-FR', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        })} ${currency || ''}`;
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return '—';
        }

        const date = new Date(
            `${dateValue}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleDateString(
            'fr-FR'
        );
    };

    if (loading) {
        return (
            <div className="transfer-table-loading">
                <div className="loading-spinner" />

                <span>
                    Chargement des virements...
                </span>
            </div>
        );
    }

    if (!transfers.length) {
        return (
            <EmptyState
                icon="↗"
                title="Aucun virement"
                description="Aucun virement ne correspond aux critères sélectionnés."
            />
        );
    }

    return (
        <div className="table-wrapper">
            <table className="data-table transfer-table">
                <thead>
                    <tr>
                        <th>
                            Référence
                        </th>

                        <th>
                            Date
                        </th>

                        <th>
                            Banque
                        </th>

                        <th>
                            Bénéficiaire
                        </th>

                        <th>
                            Montant
                        </th>

                        <th>
                            Frais
                        </th>

                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {transfers.map(
                        (transfer) => (
                            <tr
                                key={
                                    transfer.id
                                }
                            >
                                <td>
                                    <span className="table-primary">
                                        {
                                            transfer.reference
                                        }
                                    </span>
                                </td>

                                <td>
                                    {
                                        formatDate(
                                            transfer.transfer_date
                                        )
                                    }
                                </td>

                                <td>
                                    <span className="table-primary">
                                        {
                                            transfer.bank_name
                                        }
                                    </span>

                                    {transfer.debit_account && (
                                        <span className="table-secondary">
                                            {
                                                transfer.debit_account
                                            }
                                        </span>
                                    )}
                                </td>

                                <td>
                                    <span className="table-primary">
                                        {
                                            transfer.beneficiary_name
                                        }
                                    </span>

                                    {transfer.beneficiary_country && (
                                        <span className="table-secondary">
                                            {
                                                transfer.beneficiary_country
                                            }
                                        </span>
                                    )}
                                </td>

                                <td>
                                    <span className="table-primary">
                                        {formatAmount(
                                            transfer.amount,
                                            transfer.currency
                                        )}
                                    </span>
                                </td>

                                <td>
                                    <Badge
                                        variant={
                                            transfer.fees ===
                                            'OUR'
                                                ? 'info'
                                                : transfer.fees ===
                                                  'BEN'
                                                ? 'warning'
                                                : 'default'
                                        }
                                        size="small"
                                    >
                                        {
                                            transfer.fees
                                        }
                                    </Badge>
                                </td>

                                <td>
                                    <div className="table-actions">
                                        {onView && (
                                            <button
                                                type="button"
                                                className="table-action"
                                                title="Voir"
                                                onClick={() =>
                                                    onView(
                                                        transfer
                                                    )
                                                }
                                            >
                                                👁
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                className="table-action danger"
                                                title="Supprimer"
                                                onClick={() =>
                                                    onDelete(
                                                        transfer
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TransferTable;