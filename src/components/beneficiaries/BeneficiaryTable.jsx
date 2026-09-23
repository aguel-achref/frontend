import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';

function BeneficiaryTable({
    beneficiaries = [],
    loading = false,
    onEdit,
    onDelete
}) {
    if (loading) {
        return (
            <div className="table-loading">
                Chargement des bénéficiaires...
            </div>
        );
    }

    if (!beneficiaries.length) {
        return (
            <EmptyState
                icon="👤"
                title="Aucun bénéficiaire"
                description="Ajoutez votre premier bénéficiaire pour commencer."
            />
        );
    }

    return (
        <div className="data-table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Bénéficiaire</th>
                        <th>Pays</th>
                        <th>Banque</th>
                        <th>IBAN / RIB</th>
                        <th>SWIFT</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {beneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id}>
                            <td>
                                <div className="table-primary">
                                    {beneficiary.name}
                                </div>

                                {beneficiary.city && (
                                    <div className="table-secondary">
                                        {beneficiary.city}
                                    </div>
                                )}
                            </td>

                            <td>
                                {beneficiary.country || '—'}
                            </td>

                            <td>
                                {beneficiary.bank_name || '—'}
                            </td>

                            <td className="iban-cell">
                                {beneficiary.iban || '—'}
                            </td>

                            <td>
                                {beneficiary.swift || '—'}
                            </td>

                            <td>
                                <div className="table-actions">
                                    <Button
                                        size="small"
                                        variant="secondary"
                                        onClick={() =>
                                            onEdit(beneficiary)
                                        }
                                    >
                                        Modifier
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="danger"
                                        onClick={() =>
                                            onDelete(beneficiary)
                                        }
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BeneficiaryTable;