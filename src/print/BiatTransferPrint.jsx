function BoxedText({ value, className, boxWidth = 3, maxLength }) {
  const chars = (value || "")
    .toString()
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, maxLength)
    .split("");

  return (
    <div
      className={`print-box-row ${className}`}
      style={{ "--box-width": `${boxWidth}%` }}
    >
      {chars.map((char, index) => (
        <span key={index} className="print-box-char">
          {char}
        </span>
      ))}
    </div>
  );
}

function BiatTransferPrint({ transfer, bank, settings }) {
  if (!transfer) {
    return null;
  }

  return (
    <div className="bank-print-page biat-print">
      <img
        className="bank-print-background"
        src="/print/biat.png"
        alt="Formulaire BIAT"
      />

      {/* R.I.B. DU DONNEUR D'ORDRE (compte à débiter) */}
      <BoxedText
        className="biat-debit-rib"
        value={transfer.debit_account}
        boxWidth={2.52}
        maxLength={20}
      />

      {/* CODE DEVISE DU COMPTE */}
      <BoxedText
        className="biat-account-currency"
        value={transfer.currency || bank?.currency}
        boxWidth={3.81}
        maxLength={3}
      />

      {/* DONNEUR D'ORDRE */}
      <div className="print-field biat-company-name">
        {settings?.company_name || ""}
      </div>

      <div className="print-field biat-company-address">
        {settings?.address || ""}
      </div>

      <div className="print-field biat-phone">{settings?.phone || ""}</div>

      <div className="print-field biat-fax">{settings?.fax || ""}</div>

      <div className="print-field biat-telex">{settings?.telex || ""}</div>

      <div className="print-field biat-customs-code">
        {settings?.customs_code || ""}
      </div>

      <div className="print-field biat-rc">
        {settings?.rc_number || ""}
      </div>

      <div className="print-field biat-financial-code">
        {settings?.financial_code || ""}
      </div>

      <div className="print-field biat-cin">{settings?.cin || ""}</div>

      {/* MODE DE TRANSMISSION : coché en SWIFT */}
      <div className="print-field biat-check-swift">X</div>

      {/* SOMME EN TOUTES LETTRES */}
      <div className="print-field biat-amount-words">
        {transfer.amount_words || ""}
      </div>

      {/* DEVISE + MONTANT EN CHIFFRES */}
      <BoxedText
        className="biat-amount-currency"
        value={transfer.currency}
        boxWidth={3.81}
        maxLength={3}
      />

      <div className="print-field print-amount biat-amount">
        {transfer.amount || ""}
      </div>

      {/* BENEFICIAIRE */}
      <div className="print-field biat-beneficiary-name">
        {transfer.beneficiary_name || ""}
      </div>

      <div className="print-field biat-beneficiary-bank">
        {transfer.beneficiary_bank || ""}
      </div>

      <div className="print-field biat-beneficiary-bank-address">
        {transfer.beneficiary_bank_address || ""}
      </div>

      <div className="print-field biat-beneficiary-city">
        {transfer.beneficiary_city || ""}
      </div>

      <div className="print-field biat-beneficiary-country">
        {transfer.beneficiary_country || ""}
      </div>

      {/* RIB BENEFICIAIRE */}
      <BoxedText
        className="biat-beneficiary-rib"
        value={transfer.beneficiary_iban}
        boxWidth={2.86}
        maxLength={24}
      />

      <div className="print-field biat-purpose">
        {transfer.purpose || ""}
      </div>

      <div className="print-field biat-beneficiary-address">
        {transfer.beneficiary_address || ""}
      </div>

      <div className="print-field biat-fees-instructions">
        {transfer.fees || ""}
      </div>

      {/* DATE DE L'ORDRE (ligne "Tunis, le ...") */}
      <div className="print-field biat-order-date">
        {transfer.transfer_date || ""}
      </div>
    </div>
  );
}

export default BiatTransferPrint;