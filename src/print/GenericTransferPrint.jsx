function GenericTransferPrint({ transfer, bank, settings }) {
  return (
    <div className="print-a4 generic-print">
      <div className="print-company-header">
        <div>
          <h1>{settings?.company_name || "SOCIETE LEO MINOR TUNISIE"}</h1>

          <p>{settings?.address || ""}</p>

          <p>
            {settings?.postal_code || ""} {settings?.city || ""}
          </p>
        </div>

        <div className="print-document-title">
          <strong>ORDRE DE VIREMENT</strong>

          <span>Référence : {transfer.reference}</span>

          <span>Date : {transfer.transfer_date}</span>
        </div>
      </div>

      <section className="print-block">
        <h2>Banque émettrice</h2>

        <div className="print-grid">
          <div>
            <strong>Banque</strong>
            <span>{bank.name}</span>
          </div>

          <div>
            <strong>Compte à débiter</strong>
            <span>{transfer.debit_account}</span>
          </div>
        </div>
      </section>

      <section className="print-block">
        <h2>Virement</h2>

        <div className="print-grid">
          <div>
            <strong>Devise</strong>
            <span>{transfer.currency}</span>
          </div>

          <div>
            <strong>Montant</strong>
            <span>
              {Number(transfer.amount || 0).toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div>
            <strong>Frais</strong>
            <span>{transfer.fees}</span>
          </div>

          <div>
            <strong>Type d'opération</strong>
            <span>{transfer.operation_type || "—"}</span>
          </div>
        </div>

        <div className="print-full-field">
          <strong>Montant en lettres</strong>
          <span>{transfer.amount_words || "—"}</span>
        </div>

        <div className="print-full-field">
          <strong>Motif</strong>
          <span>{transfer.purpose || "—"}</span>
        </div>
      </section>

      <section className="print-block">
        <h2>Bénéficiaire</h2>

        <div className="print-grid">
          <div>
            <strong>Nom</strong>
            <span>{transfer.beneficiary_name || "—"}</span>
          </div>

          <div>
            <strong>Pays</strong>
            <span>{transfer.beneficiary_country || "—"}</span>
          </div>

          <div>
            <strong>Ville</strong>
            <span>{transfer.beneficiary_city || "—"}</span>
          </div>

          <div>
            <strong>IBAN</strong>
            <span>{transfer.beneficiary_iban || "—"}</span>
          </div>

          <div>
            <strong>Banque</strong>
            <span>{transfer.beneficiary_bank || "—"}</span>
          </div>

          <div>
            <strong>SWIFT</strong>
            <span>{transfer.beneficiary_swift || "—"}</span>
          </div>
        </div>
      </section>

      <div className="print-signatures">
        <div>Signature / Cachet</div>

        <div>Autorisation</div>
      </div>

      <footer className="print-footer">
        <span>{settings?.company_name}</span>

        <span>Référence : {transfer.reference}</span>
      </footer>
    </div>
  );
}

export default GenericTransferPrint;
