import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

function BankTable({ banks = [], loading = false, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="bank-table-loading">
        <div className="loading-spinner" />
        <span>Chargement des banques...</span>
      </div>
    );
  }

  if (!banks.length) {
    return (
      <EmptyState
        icon="🏦"
        title="Aucune banque"
        description="Aucune banque ne correspond à votre recherche."
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table bank-table">
        <thead>
          <tr>
            <th>Banque</th>
            <th>Code</th>
            <th>Compte</th>
            <th>Modèle</th>
            <th>Formulaire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {banks.map((bank) => (
            <tr key={bank.id}>
              <td>
                <div className="bank-name-cell">
                  <div className="bank-avatar">
                    {bank.name?.charAt(0)?.toUpperCase() || "B"}
                  </div>

                  <strong>{bank.name}</strong>
                </div>
              </td>

              <td>
                <span className="code-value">{bank.code}</span>
              </td>

              <td>{bank.account || "—"}</td>

              <td>
                <Badge variant="neutral" size="small">
                  {bank.template}
                </Badge>
              </td>

              <td>{bank.form_number || "—"}</td>

              <td>
                {Boolean(bank.is_active) ? (
                  <Badge variant="success" size="small">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="small">
                    Inactive
                  </Badge>
                )}
              </td>

              <td>
                <div className="table-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onEdit(bank)}
                  >
                    Modifier
                  </Button>

                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => onDelete(bank)}
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

export default BankTable;
