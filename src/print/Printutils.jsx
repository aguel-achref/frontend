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

// ---- Montant en lettres (français) -----------------------------------

const UNITS = [
  "zéro",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
];

const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];

const CURRENCY_NAMES = {
  TND: {
    major: ["dinar", "dinars"],
    minor: ["millime", "millimes"],
    decimals: 3,
  },
  EUR: {
    major: ["euro", "euros"],
    minor: ["centime", "centimes"],
    decimals: 2,
  },
  USD: {
    major: ["dollar US", "dollars US"],
    minor: ["cent", "cents"],
    decimals: 2,
  },
  GBP: {
    major: ["livre sterling", "livres sterling"],
    minor: ["penny", "pence"],
    decimals: 2,
  },
  CHF: {
    major: ["franc suisse", "francs suisses"],
    minor: ["centime", "centimes"],
    decimals: 2,
  },
};

function underHundred(n, final = true) {
  if (n < 17) {
    return UNITS[n];
  }

  if (n < 20) {
    return `dix-${UNITS[n - 10]}`;
  }

  if (n < 70) {
    const tens = Math.floor(n / 10);
    const unit = n % 10;

    if (unit === 0) {
      return TENS[tens];
    }

    if (unit === 1) {
      return `${TENS[tens]} et un`;
    }

    return `${TENS[tens]}-${UNITS[unit]}`;
  }

  if (n < 80) {
    const rest = n - 60;

    if (rest === 11) {
      return "soixante et onze";
    }

    return `soixante-${underHundred(rest)}`;
  }

  const rest = n - 80;

  if (rest === 0) {
    return final ? "quatre-vingts" : "quatre-vingt";
  }

  return `quatre-vingt-${underHundred(rest)}`;
}

function underThousand(n, final = true) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];

  if (hundreds === 1) {
    parts.push("cent");
  } else if (hundreds > 1) {
    parts.push(`${UNITS[hundreds]} cent${rest === 0 && final ? "s" : ""}`);
  }

  if (rest > 0) {
    parts.push(underHundred(rest, final));
  }

  return parts.join(" ");
}

function integerToWords(n) {
  if (n === 0) {
    return "zéro";
  }

  const billions = Math.floor(n / 1e9);
  const millions = Math.floor((n % 1e9) / 1e6);
  const thousands = Math.floor((n % 1e6) / 1e3);
  const rest = n % 1e3;
  const parts = [];

  if (billions) {
    parts.push(`${underThousand(billions)} milliard${billions > 1 ? "s" : ""}`);
  }

  if (millions) {
    parts.push(`${underThousand(millions)} million${millions > 1 ? "s" : ""}`);
  }

  if (thousands) {
    parts.push(
      thousands === 1 ? "mille" : `${underThousand(thousands, false)} mille`
    );
  }

  if (rest) {
    parts.push(underThousand(rest));
  }

  return parts.join(" ");
}

/*
  Ex. amountToWords(12345.678, "TND")
  -> "Douze mille trois cent quarante-cinq dinars et six cent
      soixante-dix-huit millimes"
*/
export function amountToWords(amount, currency) {
  const number = Number(amount);

  if (
    amount === "" ||
    amount === null ||
    amount === undefined ||
    !Number.isFinite(number)
  ) {
    return "";
  }

  const code = String(currency || "").toUpperCase();
  const names = CURRENCY_NAMES[code] || {
    major: [code, code],
    minor: ["centime", "centimes"],
    decimals: 2,
  };

  const factor = 10 ** names.decimals;
  const total = Math.round(Math.abs(number) * factor);
  const major = Math.floor(total / factor);
  const minor = total % factor;

  const majorName = major > 1 ? names.major[1] : names.major[0];

  // "un million de dinars", "deux millions d'euros"
  const link =
    major >= 1e6 && major % 1e6 === 0
      ? /^[aeiouéèêàâîïôû]/i.test(majorName)
        ? "d'"
        : "de "
      : "";

  let text = `${integerToWords(major)} ${link}${majorName}`.trim();

  if (minor > 0) {
    const minorName = minor > 1 ? names.minor[1] : names.minor[0];

    text += ` et ${integerToWords(minor)} ${minorName}`;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
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