export const FEES_LABELS = {
  SHA: "SHA - Frais partagés",
  OUR: "OUR - Frais à la charge du donneur d'ordre",
  BEN: "BEN - Frais à la charge du bénéficiaire",
};

export function formatDate(value) {
  if (!value) {
    return "";
  }

  const text = String(value);
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

  if (plain) {
    return `${plain[3]}/${plain[2]}/${plain[1]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
}

export function formatAmount(amount, currency) {
  const number = Number(amount);

  if (amount === "" || amount === null || !Number.isFinite(number)) {
    return "";
  }

  const digits = currency === "TND" ? 3 : 2;

  return number
    .toLocaleString("fr-FR", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    .replace(/[\u202f\u00a0]/g, " ");
}

/*
  One character per printed box.
  - width : total width of the whole row of boxes, in % of the page
  - count : number of printed boxes in that row
  Top / left are set by the CSS class passed in className.
*/
export function BoxedText({ value, className = "", width, count }) {
  const chars = (value || "")
    .toString()
    .toUpperCase()
    .replace(/\s+/g, "")
    .slice(0, count)
    .split("");

  return (
    <div
      className={`print-box-row ${className}`}
      style={{
        width: `${width}%`,
        "--box-width": `${100 / count}%`,
      }}
    >
      {chars.map((char, index) => (
        <span key={index} className="print-box-char">
          {char}
        </span>
      ))}
    </div>
  );
}