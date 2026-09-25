import { useEffect, useMemo, useState } from 'react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

import TransferSection from './TransferSection';

const IBAN_LENGTH = 26;

const CURRENCY_NAMES = {
    EUR: ['euro', 'euros'],
    USD: ['dollar américain', 'dollars américains'],
    TND: ['dinar tunisien', 'dinars tunisiens'],
    GBP: ['livre sterling', 'livres sterling'],
    CHF: ['franc suisse', 'francs suisses'],
};

const UNITS = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
    'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze',
    'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
];

const TENS = [
    '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante',
    'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix',
];

const capitalize = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

const convertHundreds = (n) => {
    let result = '';

    if (n >= 100) {
        const h = Math.floor(n / 100);
        const remainder = n % 100;

        result += h > 1 ? `${UNITS[h]} cent` : 'cent';

        if (h > 1 && remainder === 0) {
            result += 's';
        }

        n = remainder;

        if (n > 0) {
            result += ' ';
        }
    }

    if (n >= 20) {
        const t = Math.floor(n / 10);
        const u = n % 10;

        if (t === 7 || t === 9) {
            result += `${TENS[t - 1]}-${UNITS[10 + u]}`;
        } else {
            result += TENS[t];

            if (u === 1 && t !== 8) {
                result += ' et un';
            } else if (u > 0) {
                result += `-${UNITS[u]}`;
            } else if (t === 8) {
                result += 's';
            }
        }
    } else if (n > 0) {
        result += UNITS[n];
    }

    return result;
};

const convertIntegerToWords = (n) => {
    if (n === 0) {
        return 'zéro';
    }

    let result = '';

    const billions = Math.floor(n / 1e9);
    const millions = Math.floor((n % 1e9) / 1e6);
    const thousands = Math.floor((n % 1e6) / 1e3);
    const rest = n % 1000;

    if (billions > 0) {
        result +=
            (billions > 1
                ? `${convertHundreds(billions)} milliards`
                : 'un milliard') + ' ';
    }

    if (millions > 0) {
        result +=
            (millions > 1
                ? `${convertHundreds(millions)} millions`
                : 'un million') + ' ';
    }

    if (thousands > 0) {
        result +=
            (thousands > 1
                ? `${convertHundreds(thousands)} mille`
                : 'mille') + ' ';
    }

    if (rest > 0) {
        result += convertHundreds(rest);
    }

    return result.trim();
};

const amountToFrenchWords = (amount, currency) => {
    const [singular, plural] = CURRENCY_NAMES[currency] || [
        'unité',
        'unités',
    ];

    const value = Number(amount) || 0;
    const integerPart = Math.floor(value);
    const isMillimes = currency === 'TND';
    const subunitDigits = isMillimes ? 3 : 2;
    const subunitMax = isMillimes ? 1000 : 100;

    const decimalPart = Math.round(
        (value - integerPart) * subunitMax
    );

    let text = `${capitalize(
        convertIntegerToWords(integerPart)
    )} ${integerPart <= 1 ? singular : plural}`;

    if (decimalPart > 0) {
        const subunitLabel = isMillimes
            ? `millime${decimalPart > 1 ? 's' : ''}`
            : `centime${decimalPart > 1 ? 's' : ''}`;

        text += ` et ${convertIntegerToWords(
            decimalPart
        )} ${subunitLabel}`;
    }

    void subunitDigits;

    return text;
};

function TransferForm({
    banks = [],
    beneficiaries = [],
    onSubmit,
    onSaveBeneficiary,
    loading = false,
    initialData = null,
}) {
    const getToday = () => {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0');
        const day = String(
            date.getDate()
        ).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const emptyForm = {
        transfer_date: getToday(),
        bank_id: '',
        debit_account: '',
        currency: 'EUR',
        amount: '',
        purpose: '',
        fees: 'SHA',
        negotiated_rate: '',
        operation_type: '',
        case_reference: '',
        beneficiary_id: '',
        beneficiary_name: '',
        beneficiary_address: '',
        beneficiary_city: '',
        beneficiary_country: '',
        beneficiary_iban: '',
        beneficiary_bank_name: '',
        beneficiary_swift: '',
        beneficiary_bank_address: '',
        intermediary_bank: '',
        intermediary_swift: '',
    };

    const [form, setForm] = useState(
        initialData || emptyForm
    );

    const [errors, setErrors] = useState({});
    const [savingBeneficiary, setSavingBeneficiary] =
        useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...emptyForm,
                ...initialData,
            });
        }
    }, [initialData]);

    const selectedBank = useMemo(() => {
        return banks.find(
            (bank) =>
                String(bank.id) ===
                String(form.bank_id)
        );
    }, [banks, form.bank_id]);

    useEffect(() => {
        if (selectedBank) {
            setForm((previous) => ({
                ...previous,
                debit_account:
                    selectedBank.account || '',
            }));

            setErrors((previous) => {
                if (!previous.debit_account) {
                    return previous;
                }

                const next = { ...previous };

                delete next.debit_account;

                return next;
            });
        }
    }, [selectedBank]);

    const bankOptions = banks
        .filter((bank) => {
            return (
                bank.is_active === true ||
                bank.is_active === 1 ||
                bank.is_active === undefined
            );
        })
        .map((bank) => ({
            value: bank.id,
            label: `${bank.name} (${bank.code})`,
        }));

    const beneficiaryOptions = [
        { value: '', label: '— Nouveau bénéficiaire —' },
        ...beneficiaries.map((beneficiary) => ({
            value: beneficiary.id,
            label: beneficiary.name,
        })),
    ];

    const currencyOptions = [
        { value: 'EUR', label: 'EUR — Euro' },
        { value: 'USD', label: 'USD — Dollar américain' },
        { value: 'TND', label: 'TND — Dinar tunisien' },
        { value: 'GBP', label: 'GBP — Livre sterling' },
        { value: 'CHF', label: 'CHF — Franc suisse' },
    ];

    const feesOptions = [
        { value: 'SHA', label: 'SHA — Frais partagés' },
        { value: 'OUR', label: 'OUR — Frais à notre charge' },
        { value: 'BEN', label: 'BEN — Frais bénéficiaire' },
    ];

    const operationOptions = [
        { value: 'IMPORT', label: 'Import' },
        { value: 'EXPORT', label: 'Export' },
        { value: 'SERVICES', label: 'Services' },
        { value: 'OTHER', label: 'Autre' },
    ];

    const updateField = (name, value) => {
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }

            const next = {
                ...previous,
            };

            delete next[name];

            return next;
        });
    };

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        updateField(name, value);
    };

    const handleBeneficiarySelect = (event) => {
        const beneficiaryId = event.target.value;

        if (!beneficiaryId) {
            setForm((previous) => ({
                ...previous,
                beneficiary_id: '',
                beneficiary_name: '',
                beneficiary_address: '',
                beneficiary_city: '',
                beneficiary_country: '',
                beneficiary_iban: '',
                beneficiary_bank_name: '',
                beneficiary_swift: '',
                beneficiary_bank_address: '',
                intermediary_bank: '',
                intermediary_swift: '',
            }));

            return;
        }

        const beneficiary = beneficiaries.find(
            (item) =>
                String(item.id) === String(beneficiaryId)
        );

        if (!beneficiary) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            beneficiary_id: beneficiary.id,
            beneficiary_name: beneficiary.name || '',
            beneficiary_address:
                beneficiary.address || '',
            beneficiary_city: beneficiary.city || '',
            beneficiary_country:
                beneficiary.country || '',
            beneficiary_iban: beneficiary.iban || '',
            beneficiary_bank_name:
                beneficiary.bank_name ||
                beneficiary.bank ||
                '',
            beneficiary_swift: beneficiary.swift || '',
            beneficiary_bank_address:
                beneficiary.bank_address || '',
            intermediary_bank:
                beneficiary.intermediary_bank || '',
            intermediary_swift:
                beneficiary.intermediary_swift || '',
        }));
    };

    const buildBeneficiaryPayload = () => ({
        id: form.beneficiary_id || null,
        name: form.beneficiary_name.trim(),
        address: form.beneficiary_address.trim(),
        city: form.beneficiary_city.trim(),
        country: form.beneficiary_country.trim(),
        iban: form.beneficiary_iban.trim(),
        bank_name: form.beneficiary_bank_name.trim(),
        swift: form.beneficiary_swift.trim(),
        bank_address:
            form.beneficiary_bank_address.trim(),
        intermediary_bank:
            form.intermediary_bank.trim(),
        intermediary_swift:
            form.intermediary_swift.trim(),
    });

    const handleSaveBeneficiary = async () => {
        if (!onSaveBeneficiary) {
            return;
        }

        if (!form.beneficiary_name.trim()) {
            setErrors((previous) => ({
                ...previous,
                beneficiary_name:
                    'Le nom du bénéficiaire est obligatoire.',
            }));

            return;
        }

        setSavingBeneficiary(true);

        try {
            const saved = await onSaveBeneficiary(
                buildBeneficiaryPayload()
            );

            if (saved?.id) {
                updateField('beneficiary_id', saved.id);
            }
        } finally {
            setSavingBeneficiary(false);
        }
    };

    // IBAN boxed input -----------------------------------------------

    const ibanChars = (form.beneficiary_iban || '')
        .padEnd(IBAN_LENGTH, ' ')
        .split('');

    const handleIbanChange = (index, rawValue) => {
        const chars = (form.beneficiary_iban || '')
            .padEnd(IBAN_LENGTH, ' ')
            .split('');

        chars[index] = rawValue
            .slice(-1)
            .toUpperCase();

        const next = chars
            .join('')
            .replace(/\s+$/, '');

        updateField('beneficiary_iban', next);

        if (rawValue && index < IBAN_LENGTH - 1) {
            const nextBox = document.getElementById(
                `iban-box-${index + 1}`
            );

            if (nextBox) {
                nextBox.focus();
            }
        }
    };

    const handleIbanKeyDown = (index, event) => {
        if (
            event.key === 'Backspace' &&
            !event.target.value &&
            index > 0
        ) {
            const previousBox = document.getElementById(
                `iban-box-${index - 1}`
            );

            if (previousBox) {
                previousBox.focus();
            }
        }
    };

    const handleIbanPaste = (event) => {
        event.preventDefault();

        const pasted = event.clipboardData
            .getData('text')
            .replace(/\s+/g, '')
            .toUpperCase()
            .slice(0, IBAN_LENGTH);

        updateField('beneficiary_iban', pasted);
    };

    // Validation & submit ---------------------------------------------

    const montantEnLettres = useMemo(() => {
        if (!form.amount || Number(form.amount) <= 0) {
            return `Zéro ${
                CURRENCY_NAMES[form.currency]?.[1] ||
                'unités'
            }`;
        }

        return capitalize(
            amountToFrenchWords(
                form.amount,
                form.currency
            )
        );
    }, [form.amount, form.currency]);

    const validate = () => {
        const nextErrors = {};

        if (!form.transfer_date) {
            nextErrors.transfer_date =
                "La date de l'ordre est obligatoire.";
        }

        if (!form.bank_id) {
            nextErrors.bank_id =
                'La banque est obligatoire.';
        }

        if (!form.debit_account) {
            nextErrors.debit_account =
                'Le compte débiteur est obligatoire.';
        }

        if (!form.currency) {
            nextErrors.currency =
                'La devise est obligatoire.';
        }

        if (
            !form.amount ||
            Number(form.amount) <= 0
        ) {
            nextErrors.amount =
                'Le montant doit être supérieur à 0.';
        }

        if (!form.case_reference) {
            nextErrors.case_reference =
                'La référence dossier est obligatoire.';
        }

        if (!form.beneficiary_id) {
            if (!form.beneficiary_address) {
                nextErrors.beneficiary_address =
                    "L'adresse du bénéficiaire est obligatoire.";
            }

            if (!form.beneficiary_swift) {
                nextErrors.beneficiary_swift =
                    'Le SWIFT / BIC est obligatoire.';
            }

            if (!form.beneficiary_bank_address) {
                nextErrors.beneficiary_bank_address =
                    "L'adresse de la banque est obligatoire.";
            }

            if (!form.beneficiary_name) {
                nextErrors.beneficiary_name =
                    'Le nom du bénéficiaire est obligatoire.';
            }
        }

        setErrors(nextErrors);

        return (
            Object.keys(nextErrors).length === 0
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        let beneficiaryId = form.beneficiary_id
            ? Number(form.beneficiary_id)
            : null;

        if (!beneficiaryId) {
            if (!onSaveBeneficiary) {
                setErrors((previous) => ({
                    ...previous,
                    beneficiary_name:
                        'Enregistrez le bénéficiaire avant de créer le virement.',
                }));

                return;
            }

            setSavingBeneficiary(true);

            try {
                const saved = await onSaveBeneficiary(
                    buildBeneficiaryPayload()
                );

                if (!saved?.id) {
                    setErrors((previous) => ({
                        ...previous,
                        beneficiary_name:
                            "Impossible d'enregistrer le bénéficiaire.",
                    }));

                    return;
                }

                beneficiaryId = Number(saved.id);
                updateField(
                    'beneficiary_id',
                    saved.id
                );
            } finally {
                setSavingBeneficiary(false);
            }
        }

        const payload = {
            transfer_date: form.transfer_date,
            bank_id: Number(form.bank_id),
            debit_account:
                form.debit_account.trim(),
            currency: form.currency,
            amount: Number(form.amount),
            amount_in_words: montantEnLettres,
            purpose: form.purpose.trim(),
            fees: form.fees,
            negotiated_rate:
                form.negotiated_rate.trim(),
            operation_type: form.operation_type,
            case_reference:
                form.case_reference.trim(),
            beneficiary_id: beneficiaryId,
            beneficiary: {
                ...buildBeneficiaryPayload(),
                id: beneficiaryId,
            },
        };

        await onSubmit(payload);
    };

    const resetForm = () => {
        setForm(emptyForm);
        setErrors({});
    };

    return (
        <form
            className="transfer-form"
            onSubmit={handleSubmit}
        >
            <TransferSection
                number="01"
                title="Banque émettrice"
                description="Sélectionnez la banque, le compte à débiter et la date de l'ordre."
            >
                <div className="form-grid-3">
                    <Select
                        label="Banque"
                        name="bank_id"
                        value={form.bank_id}
                        onChange={handleChange}
                        options={bankOptions}
                        placeholder="Sélectionner une banque"
                        required
                        error={errors.bank_id}
                    />

                    <Input
                        label="Compte à débiter"
                        name="debit_account"
                        value={
                            form.debit_account
                        }
                        onChange={handleChange}
                        placeholder="Sélectionnez une banque"
                        required
                        disabled
                        error={
                            errors.debit_account
                        }
                    />

                    <Input
                        label="Date de l'ordre"
                        name="transfer_date"
                        type="date"
                        value={
                            form.transfer_date
                        }
                        onChange={handleChange}
                        required
                        error={
                            errors.transfer_date
                        }
                    />
                </div>

                {selectedBank && (
                    <div className="selected-bank-info">
                        <div className="selected-bank-logo">
                            {selectedBank.code
                                ?.slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {selectedBank.name}
                            </strong>

                            <span>
                                Code :{' '}
                                {selectedBank.code}
                            </span>
                        </div>

                        {selectedBank.template && (
                            <span className="selected-bank-template">
                                {selectedBank.template}
                            </span>
                        )}
                    </div>
                )}
            </TransferSection>

            <TransferSection
                number="02"
                title="Virement"
                description="Renseignez les informations principales du virement."
            >
                <div className="form-grid-3">
                    <Select
                        label="Devise"
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        options={
                            currencyOptions
                        }
                        required
                        error={
                            errors.currency
                        }
                    />

                    <Input
                        label="Montant"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.001"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="0,00"
                        required
                        error={errors.amount}
                    />

                    <div className="form-group">
                        <label className="form-label">
                            Montant en lettres
                        </label>

                        <div className="amount-in-words">
                            {montantEnLettres}
                        </div>
                    </div>
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Input
                        label="Objet / motif du virement"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        placeholder="Ex. Règlement facture / Pro forma n°..."
                    />

                    <Select
                        label="Répartition des frais"
                        name="fees"
                        value={form.fees}
                        onChange={handleChange}
                        options={feesOptions}
                    />
                </div>

                <div className="form-grid-3 transfer-form-row">
                    <Input
                        label="Cours négocié / Référence"
                        name="negotiated_rate"
                        value={
                            form.negotiated_rate
                        }
                        onChange={handleChange}
                        placeholder="Optionnel"
                    />

                    <Select
                        label="Opération"
                        name="operation_type"
                        value={
                            form.operation_type
                        }
                        onChange={handleChange}
                        options={
                            operationOptions
                        }
                        placeholder="—"
                    />

                    <Input
                        label="Référence dossier"
                        name="case_reference"
                        value={
                            form.case_reference
                        }
                        onChange={handleChange}
                        placeholder="Optionnel"
                        required
                        error={
                            errors.case_reference
                        }
                    />
                </div>
            </TransferSection>

            <TransferSection
                number="03"
                title="Bénéficiaire"
                description="Sélectionnez un bénéficiaire enregistré ou saisissez ses informations."
            >
                <div className="beneficiary-select-row">
                    <Select
                        label="Bénéficiaire enregistré"
                        name="beneficiary_id"
                        value={
                            form.beneficiary_id
                        }
                        onChange={
                            handleBeneficiarySelect
                        }
                        options={
                            beneficiaryOptions
                        }
                    />

                    {onSaveBeneficiary && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={
                                handleSaveBeneficiary
                            }
                            loading={
                                savingBeneficiary
                            }
                        >
                            Enregistrer / mettre à
                            jour
                        </Button>
                    )}
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Input
                        label="Nom / raison sociale"
                        name="beneficiary_name"
                        value={
                            form.beneficiary_name
                        }
                        onChange={handleChange}
                        error={
                            errors.beneficiary_name
                        }
                    />

                    <Input
                        label="Adresse bénéficiaire"
                        name="beneficiary_address"
                        value={
                            form.beneficiary_address
                        }
                        onChange={handleChange}
                        required
                        error={
                            errors.beneficiary_address
                        }
                    />
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Input
                        label="Ville"
                        name="beneficiary_city"
                        value={
                            form.beneficiary_city
                        }
                        onChange={handleChange}
                    />

                    <Input
                        label="Pays"
                        name="beneficiary_country"
                        value={
                            form.beneficiary_country
                        }
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group transfer-form-row">
                    <label className="form-label">
                        IBAN / RIB bénéficiaire
                    </label>

                    <div
                        className="iban-boxes"
                        onPaste={handleIbanPaste}
                    >
                        {Array.from({
                            length: IBAN_LENGTH,
                        }).map((_, index) => (
                            <input
                                key={index}
                                id={`iban-box-${index}`}
                                className="iban-box"
                                maxLength={1}
                                value={
                                    ibanChars[
                                        index
                                    ]?.trim() || ''
                                }
                                onChange={(event) =>
                                    handleIbanChange(
                                        index,
                                        event.target
                                            .value
                                    )
                                }
                                onKeyDown={(event) =>
                                    handleIbanKeyDown(
                                        index,
                                        event
                                    )
                                }
                            />
                        ))}
                    </div>

                    <span className="form-help">
                        Saisissez un caractère par
                        case. Le curseur avance
                        automatiquement.
                    </span>
                </div>

                <div className="form-grid-3 transfer-form-row">
                    <Input
                        label="Banque bénéficiaire"
                        name="beneficiary_bank_name"
                        value={
                            form.beneficiary_bank_name
                        }
                        onChange={handleChange}
                    />

                    <Input
                        label="SWIFT / BIC"
                        name="beneficiary_swift"
                        value={
                            form.beneficiary_swift
                        }
                        onChange={handleChange}
                        required
                        error={
                            errors.beneficiary_swift
                        }
                    />

                    <Input
                        label="Adresse banque"
                        name="beneficiary_bank_address"
                        value={
                            form.beneficiary_bank_address
                        }
                        onChange={handleChange}
                        required
                        error={
                            errors.beneficiary_bank_address
                        }
                    />
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Input
                        label="Banque intermédiaire"
                        name="intermediary_bank"
                        value={
                            form.intermediary_bank
                        }
                        onChange={handleChange}
                        placeholder="Optionnel"
                    />

                    <Input
                        label="SWIFT banque intermédiaire"
                        name="intermediary_swift"
                        value={
                            form.intermediary_swift
                        }
                        onChange={handleChange}
                        placeholder="Optionnel"
                    />
                </div>

                {beneficiaries.length === 0 &&
                    !form.beneficiary_name && (
                        <div className="transfer-inline-warning">
                            <span>!</span>

                            <div>
                                <strong>
                                    Aucun
                                    bénéficiaire
                                    enregistré
                                </strong>

                                <p>
                                    Renseignez les
                                    informations
                                    ci-dessus pour
                                    créer un
                                    nouveau
                                    bénéficiaire.
                                </p>
                            </div>
                        </div>
                    )}
            </TransferSection>

            <TransferSection
                number="04"
                title="Finalisation"
                description="Vérifiez les informations avant d'enregistrer le virement."
            >
                <div className="transfer-final-check">
                    <div>
                        <span>Banque</span>

                        <strong>
                            {selectedBank?.name ||
                                '—'}
                        </strong>
                    </div>

                    <div>
                        <span>Montant</span>

                        <strong>
                            {form.amount
                                ? `${Number(
                                      form.amount
                                  ).toLocaleString(
                                      'fr-FR',
                                      {
                                          minimumFractionDigits: 3,
                                      }
                                  )} ${
                                      form.currency
                                  }`
                                : '—'}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Bénéficiaire
                        </span>

                        <strong>
                            {form.beneficiary_name ||
                                '—'}
                        </strong>
                    </div>
                </div>
            </TransferSection>

            <div className="transfer-form-actions">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                    disabled={loading}
                >
                    Réinitialiser
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon="+"
                >
                    Créer le virement
                </Button>
            </div>
        </form>
    );
}

export default TransferForm;