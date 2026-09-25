function AttijariTransferPrint({ transfer, bank, settings }) {
  if (!transfer) {
    return null;
  }

  const companyName = settings?.company_name || "SOCIETE LEO MINOR TUNISIE";

  const companyAddress = settings?.address || "";

  const companyCity = settings?.city || "";

  const companyPostalCode = settings?.postal_code || "";

  const companyRne = settings?.rne || "";

  const companyCustomsCode = settings?.customs_code || "";

  return (
    <div className="bank-print-page attijari-print">
      {/* IMAGE DU FORMULAIRE */}
      <img
        className="bank-print-background"
        src="/print/attijari.png"
        alt="Formulaire Attijari"
      />

      {/* NUMÉRO D'OPÉRATION */}
      <div className="print-field att-operation-number">
        {transfer.reference || ""}
      </div>

      {/* DATE */}
      <div className="print-field att-operation-date">
        {transfer.transfer_date || ""}
      </div>

      {/* DONNEUR D'ORDRE */}
      <div className="print-field att-company-name">{companyName}</div>

      <div className="print-field att-company-address">{companyAddress}</div>

      <div className="print-field att-company-city">{companyCity}</div>

      <div className="print-field att-company-postal">{companyPostalCode}</div>

      <div className="print-field att-company-rne">{companyRne}</div>

      <div className="print-field att-company-customs">
        {companyCustomsCode}
      </div>

      {/* BANQUE */}
      <div className="print-field att-bank-name">
        {bank?.name || "Attijari Bank"}
      </div>

      <div className="print-field att-bank-account">
        {transfer.debit_account || ""}
      </div>

      <div className="print-field att-account-currency">
        {transfer.currency || ""}
      </div>

      {/* VIREMENT */}
      <div className="print-field att-transfer-date">
        {transfer.transfer_date || ""}
      </div>

      <div className="print-field att-currency">{transfer.currency || ""}</div>

      <div className="print-field att-amount">{transfer.amount || ""}</div>

      <div className="print-field att-rate">
        {transfer.negotiated_rate || ""}
      </div>

      <div className="print-field att-operation-type">
        {transfer.operation_type || ""}
      </div>

      <div className="print-field att-case-reference">
        {transfer.case_reference || ""}
      </div>

      <div className="print-field att-purpose">{transfer.purpose || ""}</div>

      {/* FRAIS */}
      <div className="print-field att-fees">{transfer.fees || ""}</div>

      {/* BENEFICIAIRE */}
      <div className="print-field att-beneficiary-name">
        {transfer.beneficiary_name || ""}
      </div>

      <div className="print-field att-beneficiary-address">
        {transfer.beneficiary_address || ""}
      </div>

      <div className="print-field att-beneficiary-city">
        {transfer.beneficiary_city || ""}
      </div>

      <div className="print-field att-beneficiary-country">
        {transfer.beneficiary_country || ""}
      </div>

      <div className="print-field att-beneficiary-iban">
        {transfer.beneficiary_iban || ""}
      </div>

      <div className="print-field att-beneficiary-bank">
        {transfer.beneficiary_bank || ""}
      </div>

      <div className="print-field att-beneficiary-swift">
        {transfer.beneficiary_swift || ""}
      </div>

      <div className="print-field att-beneficiary-bank-address">
        {transfer.beneficiary_bank_address || ""}
      </div>

      {/* BANQUE INTERMEDIAIRE */}
      <div className="print-field att-intermediary-bank">
        {transfer.intermediary_bank || ""}
      </div>

      <div className="print-field att-intermediary-swift">
        {transfer.intermediary_swift || ""}
      </div>

      {/* MONTANT EN LETTRES */}
      <div className="print-field att-amount-words">
        {transfer.amount_words || ""}
      </div>
    </div>
  );
}

export default AttijariTransferPrint;
