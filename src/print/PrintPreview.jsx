import AttijariTransferPrint from "./AttijariTransferPrint";
import BiatTransferPrint from "./BiatTransferPrint";

function PrintPreview({ transfer, bank, settings }) {
  if (!transfer || !bank) {
    return null;
  }

  const template = String(bank.template || "").toUpperCase();

  return (
    <div id="print-root" className="print-preview-container">
      {template === "ATTIJARI" && (
        <AttijariTransferPrint
          transfer={transfer}
          bank={bank}
          settings={settings}
        />
      )}

      {template === "BIAT" && (
        <BiatTransferPrint
          transfer={transfer}
          bank={bank}
          settings={settings}
        />
      )}

      {template !== "ATTIJARI" && template !== "BIAT" && (
        <div className="print-generic-warning">
          Aucun modèle d'impression configuré pour cette banque.
        </div>
      )}
    </div>
  );
}

export default PrintPreview;
