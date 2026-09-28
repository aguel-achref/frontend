import { formatAmount, formatDate } from "./Printutils";

/*
  The 12 IBAN boxes of the Attijari form (left / width in % of the page).
  Each box receives 2 characters (24 characters = Tunisian IBAN).
*/
const IBAN_BOXES = [
  [20.06, 4.45],
  [25.07, 5.3],
  [30.94, 5.68],
  [37.28, 5.77],
  [43.61, 5.68],
  [49.95, 5.58],
  [56.2, 5.68],
  [62.53, 5.68],
  [68.88, 5.77],
  [75.31, 6.53],
  [82.5, 5.87],
  [89.03, 5.96],
];

function splitIban(value) {
  const clean = (value || "").toString().replace(/\s+/g, "").toUpperCase();

  return IBAN_BOXES.map((_, index) => {
    if (index === IBAN_BOXES.length - 1) {
      return clean.slice(index * 2);
    }

    return clean.slice(index * 2, index * 2 + 2);
  });
}

function AttijariTransferPrint({ transfer, bank, settings }) {
  if (!transfer) {
    return null;
  }

  const currency = transfer.currency || "";
  const fees = String(transfer.fees || "").toUpperCase();
  const ibanGroups = splitIban(transfer.beneficiary_iban);

  return (
    <div className="bank-print-page attijari-print">
      <img
        className="bank-print-background"
        src="/print/attijari.png"
        alt="Formulaire Attijari Bank"
      />

      {/* N° d'opération + date */}
      <div className="print-field att-operation-number">
        {transfer.reference || ""}
      </div>

      <div className="print-field att-operation-date">
        {formatDate(transfer.transfer_date)}
      </div>

      {/* 1. Donneur d'ordre */}
      <div className="print-field att-company-name">
        {settings?.company_name || ""}
      </div>

      <div className="print-field att-company-address">
        {settings?.address || ""}
      </div>

      <div className="print-field att-company-city">{settings?.city || ""}</div>

      <div className="print-field att-company-postal">
        {settings?.postal_code || ""}
      </div>

      <div className="print-field att-company-rne">{settings?.rne || ""}</div>

      <div className="print-field att-company-customs">
        {settings?.customs_code || ""}
      </div>

      {/* 2. Banque / compte à débiter */}
      <div className="print-field att-bank-name">{bank?.name || ""}</div>

      <div className="print-field att-bank-agency">{bank?.agency || ""}</div>

      <div className="print-field att-bank-account">
        {transfer.debit_account || ""}
      </div>

      <div className="print-field att-account-currency">
        {bank?.currency || currency}
      </div>

      {/* 3. Informations du virement */}
      <div className="print-field att-transfer-date">
        {formatDate(transfer.transfer_date)}
      </div>

      <div className="print-field att-currency">{currency}</div>

      <div className="print-field att-amount">
        {formatAmount(transfer.amount, currency)}
      </div>

      {fees === "SHA" && <div className="print-field att-fees-sha">X</div>}
      {fees === "OUR" && <div className="print-field att-fees-our">X</div>}
      {fees === "BEN" && <div className="print-field att-fees-ben">X</div>}

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

      {/* 4. Bénéficiaire */}
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

      {ibanGroups.map((group, index) => (
        <div
          key={index}
          className="print-field att-iban-group"
          style={{
            left: `${IBAN_BOXES[index][0]}%`,
            width: `${IBAN_BOXES[index][1]}%`,
          }}
        >
          {group}
        </div>
      ))}

      <div className="print-field att-beneficiary-bank">
        {transfer.beneficiary_bank || ""}
      </div>

      <div className="print-field att-beneficiary-swift">
        {transfer.beneficiary_swift || ""}
      </div>

      <div className="print-field att-beneficiary-bank-address">
        {transfer.beneficiary_bank_address || ""}
      </div>

      {/* 5. Banque intermédiaire */}
      <div className="print-field att-intermediary-bank">
        {transfer.intermediary_bank || ""}
      </div>

      <div className="print-field att-intermediary-swift">
        {transfer.intermediary_swift || ""}
      </div>

      {/* 6. Montant en lettres */}
      <div className="print-field att-amount-words">
        {transfer.amount_words || ""}
      </div>
    </div>
  );
}

export default AttijariTransferPrint;