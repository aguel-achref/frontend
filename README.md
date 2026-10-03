# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## SQL based documentation
CREATE DATABASE IF NOT EXISTS leo_minor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE leo_minor;


-- =========================================================
-- PARAMETRES SOCIETE
-- =========================================================

CREATE TABLE company_settings (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),

    customs_code VARCHAR(100),
    rne VARCHAR(100),
    phone VARCHAR(50),
    financial_code VARCHAR(100),

    biat_account VARCHAR(100),
    attijari_account VARCHAR(100),

    next_transfer_number INT UNSIGNED NOT NULL DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- BANQUES
-- =========================================================

CREATE TABLE banks (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,

    account VARCHAR(100),

    template ENUM(
        'GENERIC',
        'BIAT',
        'ATTIJARI'
    ) NOT NULL DEFAULT 'GENERIC',

    form_number VARCHAR(100),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- BENEFICIAIRES
-- =========================================================

CREATE TABLE beneficiaries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),

    iban VARCHAR(100),
    bank_name VARCHAR(255),
    swift VARCHAR(50),
    bank_address VARCHAR(255),

    intermediary_bank VARCHAR(255),
    intermediary_swift VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- VIREMENTS
-- =========================================================

CREATE TABLE transfers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    reference VARCHAR(50) NOT NULL UNIQUE,

    transfer_date DATE NOT NULL,

    bank_id INT UNSIGNED NOT NULL,

    debit_account VARCHAR(100) NOT NULL,

    currency VARCHAR(10) NOT NULL,

    amount DECIMAL(15,3) NOT NULL,

    amount_words TEXT,

    purpose TEXT,

    fees ENUM(
        'SHA',
        'OUR',
        'BEN'
    ) NOT NULL DEFAULT 'SHA',

    negotiated_rate VARCHAR(100),
    operation_type VARCHAR(100),
    case_reference VARCHAR(100),

    beneficiary_id INT UNSIGNED,

    beneficiary_name VARCHAR(255),
    beneficiary_address VARCHAR(255),
    beneficiary_city VARCHAR(100),
    beneficiary_country VARCHAR(100),
    beneficiary_iban VARCHAR(100),
    beneficiary_bank VARCHAR(255),
    beneficiary_swift VARCHAR(50),
    beneficiary_bank_address VARCHAR(255),
    intermediary_bank VARCHAR(255),
    intermediary_swift VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transfer_bank
        FOREIGN KEY (bank_id)
        REFERENCES banks(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_transfer_beneficiary
        FOREIGN KEY (beneficiary_id)
        REFERENCES beneficiaries(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


-- =========================================================
-- DONNEES INITIALES
-- =========================================================

INSERT INTO company_settings (
    company_name,
    address,
    city,
    postal_code,
    customs_code,
    rne,
    phone,
    financial_code,
    biat_account,
    attijari_account,
    next_transfer_number
)
VALUES (
    'SOCIETE LEO MINOR TUNISIE',
    'Bld de l''environnement',
    'BENI HASSEN',
    '5014',
    '1325995P00',
    'B15223542013',
    '',
    '',
    '08 089 0250751000207 93',
    'TN59 04503021009031924543',
    1
);


INSERT INTO banks (
    code,
    name,
    account,
    template,
    form_number
)
VALUES
(
    'BIAT',
    'BIAT',
    '08 089 0250751000207 93',
    'BIAT',
    '93'
),
(
    'ATTIJARI',
    'Attijari Bank',
    'TN59 04503021009031924543',
    'ATTIJARI',
    '140'
);
