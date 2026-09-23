import { useEffect, useMemo, useState } from 'react';

import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

import TransferSection from './TransferSection';

function TransferForm({
    banks = [],
    beneficiaries = [],
    onSubmit,
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
    };

    const [form, setForm] = useState(
        initialData || emptyForm
    );

    const [errors, setErrors] = useState({});

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

    const selectedBeneficiary = useMemo(() => {
        return beneficiaries.find(
            (beneficiary) =>
                String(beneficiary.id) ===
                String(form.beneficiary_id)
        );
    }, [
        beneficiaries,
        form.beneficiary_id,
    ]);

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

    const beneficiaryOptions =
        beneficiaries.map((beneficiary) => ({
            value: beneficiary.id,
            label: beneficiary.name,
        }));

    const currencyOptions = [
        {
            value: 'EUR',
            label: 'EUR — Euro',
        },
        {
            value: 'USD',
            label: 'USD — Dollar américain',
        },
        {
            value: 'TND',
            label: 'TND — Dinar tunisien',
        },
        {
            value: 'GBP',
            label: 'GBP — Livre sterling',
        },
        {
            value: 'CHF',
            label: 'CHF — Franc suisse',
        },
    ];

    const feesOptions = [
        {
            value: 'SHA',
            label: 'SHA — Frais partagés',
        },
        {
            value: 'OUR',
            label: 'OUR — Frais à notre charge',
        },
        {
            value: 'BEN',
            label: 'BEN — Frais bénéficiaire',
        },
    ];

    const operationOptions = [
        {
            value: 'IMPORT',
            label: 'Import',
        },
        {
            value: 'EXPORT',
            label: 'Export',
        },
        {
            value: 'SERVICES',
            label: 'Services',
        },
        {
            value: 'OTHER',
            label: 'Autre',
        },
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

    const handleBeneficiaryChange = (event) => {
        const beneficiaryId =
            event.target.value;

        updateField(
            'beneficiary_id',
            beneficiaryId
        );
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.transfer_date) {
            nextErrors.transfer_date =
                'La date est obligatoire.';
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

        if (!form.beneficiary_id) {
            nextErrors.beneficiary_id =
                'Le bénéficiaire est obligatoire.';
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

        const payload = {
            transfer_date:
                form.transfer_date,

            bank_id: Number(
                form.bank_id
            ),

            debit_account:
                form.debit_account.trim(),

            currency:
                form.currency,

            amount:
                Number(form.amount),

            purpose:
                form.purpose.trim(),

            fees:
                form.fees,

            negotiated_rate:
                form.negotiated_rate.trim(),

            operation_type:
                form.operation_type,

            case_reference:
                form.case_reference.trim(),

            beneficiary_id:
                Number(
                    form.beneficiary_id
                ),
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
                description="Sélectionnez la banque et le compte à débiter."
            >
                <div className="form-grid">
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
                        label="Compte débiteur"
                        name="debit_account"
                        value={
                            form.debit_account
                        }
                        onChange={handleChange}
                        placeholder="Ex. 123456789012"
                        required
                        error={
                            errors.debit_account
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
                    <Input
                        label="Date du virement"
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
                        placeholder="0.000"
                        required
                        error={errors.amount}
                    />
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Select
                        label="Répartition des frais"
                        name="fees"
                        value={form.fees}
                        onChange={handleChange}
                        options={feesOptions}
                    />

                    <Input
                        label="Cours négocié"
                        name="negotiated_rate"
                        value={
                            form.negotiated_rate
                        }
                        onChange={handleChange}
                        placeholder="Ex. 3.4200"
                    />
                </div>

                <div className="form-grid-2 transfer-form-row">
                    <Select
                        label="Type d'opération"
                        name="operation_type"
                        value={
                            form.operation_type
                        }
                        onChange={handleChange}
                        options={
                            operationOptions
                        }
                        placeholder="Sélectionner"
                    />

                    <Input
                        label="Référence dossier"
                        name="case_reference"
                        value={
                            form.case_reference
                        }
                        onChange={handleChange}
                        placeholder="Ex. DOS-2026-001"
                    />
                </div>

                <div className="form-field transfer-form-row">
                    <label htmlFor="purpose">
                        Motif du virement
                    </label>

                    <textarea
                        id="purpose"
                        name="purpose"
                        value={form.purpose}
                        onChange={handleChange}
                        placeholder="Décrivez le motif du virement..."
                        className="form-textarea"
                        rows="4"
                    />
                </div>
            </TransferSection>

            <TransferSection
                number="03"
                title="Bénéficiaire"
                description="Sélectionnez le bénéficiaire du virement."
            >
                <Select
                    label="Bénéficiaire"
                    name="beneficiary_id"
                    value={
                        form.beneficiary_id
                    }
                    onChange={
                        handleBeneficiaryChange
                    }
                    options={
                        beneficiaryOptions
                    }
                    placeholder={
                        beneficiaries.length
                            ? 'Sélectionner un bénéficiaire'
                            : 'Aucun bénéficiaire disponible'
                    }
                    required
                    disabled={
                        beneficiaries.length === 0
                    }
                    error={
                        errors.beneficiary_id
                    }
                />

                {selectedBeneficiary && (
                    <div className="beneficiary-preview">
                        <div className="beneficiary-preview-avatar">
                            {selectedBeneficiary.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="beneficiary-preview-main">
                            <strong>
                                {
                                    selectedBeneficiary.name
                                }
                            </strong>

                            {selectedBeneficiary.address && (
                                <span>
                                    {
                                        selectedBeneficiary.address
                                    }
                                </span>
                            )}

                            <div className="beneficiary-preview-details">
                                {selectedBeneficiary.country && (
                                    <span>
                                        {
                                            selectedBeneficiary.country
                                        }
                                    </span>
                                )}

                                {selectedBeneficiary.iban && (
                                    <span>
                                        IBAN :{' '}
                                        {
                                            selectedBeneficiary.iban
                                        }
                                    </span>
                                )}

                                {selectedBeneficiary.swift && (
                                    <span>
                                        SWIFT :{' '}
                                        {
                                            selectedBeneficiary.swift
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {beneficiaries.length === 0 && (
                    <div className="transfer-inline-warning">
                        <span>!</span>

                        <div>
                            <strong>
                                Aucun bénéficiaire
                            </strong>

                            <p>
                                Vous devez créer un
                                bénéficiaire avant de
                                créer un virement.
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
                        <span>
                            Banque
                        </span>

                        <strong>
                            {selectedBank?.name ||
                                '—'}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Montant
                        </span>

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
                            {selectedBeneficiary?.name ||
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
                    disabled={
                        beneficiaries.length ===
                        0
                    }
                    icon="+"
                >
                    Créer le virement
                </Button>
            </div>
        </form>
    );
}

export default TransferForm;