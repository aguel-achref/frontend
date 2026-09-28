import { BoxedText, FEES_LABELS, formatAmount, formatDate } from "./Printutils";

/*
  Number of printed boxes on the BIAT form.
  If your printed R.I.B. row has a different count, change it here.
*/
const DEBIT_RIB_BOXES = 20;
const BENEFICIARY_RIB_BOXES = 26;

function BiatTransferPrint({ transfer, bank, settings }) {
  if (!transfer) {
    return null;
  }

  const currency = transfer.currency || bank?.currency || "";

  return (
    <div className="bank-print-page biat-print">
      <img
        className="bank-print-background"
        src="/print/biat.png"
        alt="Formulaire BIAT"
      />

      {/* Référence (à gauche du "93" pré-imprimé) */}
      <div className="print-field biat-ref">{transfer.reference || ""}</div>

      {/* R.I.B. + code devise */}
      <BoxedText
        className="biat-debit-rib"
        value={transfer.debit_account}
        width={34.44}
        count={DEBIT_RIB_BOXES}
      />

      <BoxedText
        className="biat-account-currency"
        value={currency}
        width={7.95}
        count={3}
      />

      {/* Donneur d'ordre */}
      <div className="print-field biat-company-name">
        {settings?.company_name || ""}
      </div>

      <div className="print-field biat-company-address">
        {[settings?.address, settings?.postal_code, settings?.city]
          .filter(Boolean)
          .join(" - ")}
      </div>

      <div className="print-field biat-phone">{settings?.phone || ""}</div>
      <div className="print-field biat-fax">{settings?.fax || ""}</div>
      <div className="print-field biat-telex">{settings?.telex || ""}</div>

      <div className="print-field biat-customs-code">
        {settings?.customs_code || ""}
      </div>

      <div className="print-field biat-rc">
        {settings?.rc_number || settings?.rne || ""}
      </div>

      <div className="print-field biat-financial-code">
        {settings?.financial_code || ""}
      </div>

      <div className="print-field biat-cin">{settings?.cin || ""}</div>

      {/* Mode : Swift */}
      <div className="print-field biat-check-swift">X</div>

      {/* Somme en toutes lettres */}
      <div className="print-field biat-amount-words">
        {transfer.amount_words || ""}
      </div>

      {/* Devise + montant en chiffres */}
      <BoxedText
        className="biat-amount-currency"
        value={currency}
        width={7.95}
        count={3}
      />

      <div className="print-field biat-amount">
        {formatAmount(transfer.amount, currency)}
      </div>

      {/* Bénéficiaire */}
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

      <BoxedText
        className="biat-beneficiary-rib"
        value={transfer.beneficiary_iban}
        width={58}
        count={BENEFICIARY_RIB_BOXES}
      />

      <div className="print-field biat-purpose">{transfer.purpose || ""}</div>

      <div className="print-field biat-beneficiary-address">
        {transfer.beneficiary_address || ""}
      </div>

      <div className="print-field biat-fees-instructions">
        {FEES_LABELS[transfer.fees] || transfer.fees || ""}
      </div>

      {/* Tunis, le ... */}
      <div className="print-field biat-order-date">
        {formatDate(transfer.transfer_date)}
      </div>
    </div>
  );
}

export default BiatTransferPrint;