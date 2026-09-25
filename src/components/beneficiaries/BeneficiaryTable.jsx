import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

function BeneficiaryTable({
  beneficiaries = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="beneficiary-table-loading">
        <div className="loading-spinner" />
        <span>Chargement des bénéficiaires...</span>
      </div>
    );
  }

  if (!beneficiaries.length) {
    return (
      <EmptyState
        icon="👤"
        title="Aucun bénéficiaire"
        description="Aucun bénéficiaire ne correspond à votre recherche."
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table beneficiary-table">
        <thead>
          <tr>
            <th>Bénéficiaire</th>
            <th>Pays</th>
            <th>Banque</th>
            <th>IBAN</th>
            <th>SWIFT</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.id}>
              <td>
                <div className="beneficiary-name-cell">
                  <div className="beneficiary-avatar">
                    {beneficiary.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div>
                    <strong>{beneficiary.name}</strong>

                    {beneficiary.city && <span>{beneficiary.city}</span>}
                  </div>
                </div>
              </td>

              <td>{beneficiary.country || "—"}</td>

              <td>
                <div className="beneficiary-bank-cell">
                  <strong>{beneficiary.bank_name || "—"}</strong>

                  {beneficiary.bank_address && (
                    <span>{beneficiary.bank_address}</span>
                  )}
                </div>
              </td>

              <td>
                <span className="iban-value">{beneficiary.iban || "—"}</span>
              </td>

              <td>
                {beneficiary.swift ? (
                  <Badge variant="neutral" size="small">
                    {beneficiary.swift}
                  </Badge>
                ) : (
                  "—"
                )}
              </td>

              <td>
                <div className="table-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onEdit(beneficiary)}
                  >
                    Modifier
                  </Button>

                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onDelete(beneficiary)}
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
