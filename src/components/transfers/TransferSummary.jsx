function TransferSummary({
    transfer = {},
    bank = null,
    beneficiary = null,
}) {
    const formatAmount = () => {
        if (
            transfer.amount === undefined ||
            transfer.amount === null ||
            transfer.amount === ''
        ) {
            return '—';
        }

        return `${Number(
            transfer.amount
        ).toLocaleString('fr-FR', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        })} ${transfer.currency || ''}`;
    };

    const formatDate = () => {
        if (!transfer.transfer_date) {
            return '—';
        }

        const date = new Date(
            `${transfer.transfer_date}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
            return transfer.transfer_date;
        }

        return date.toLocaleDateString(
            'fr-FR'
        );
    };

    return (
        <div className="transfer-summary">
            <div className="transfer-summary-header">
                <div>
                    <span>
                        RÉCAPITULATIF DU VIREMENT
                    </span>

                    <h3>
                        Vérification des informations
                    </h3>
                </div>

                {transfer.reference && (
                    <div className="transfer-reference">
                        <span>
                            Référence
                        </span>

                        <strong>
                            {transfer.reference}
                        </strong>
                    </div>
                )}
            </div>

            <div className="transfer-summary-grid">
                <div className="summary-item">
                    <span>
                        Date
                    </span>

                    <strong>
                        {formatDate()}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        Banque
                    </span>

                    <strong>
                        {bank?.name ||
                            transfer.bank_name ||
                            '—'}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        Compte débiteur
                    </span>

                    <strong>
                        {transfer.debit_account ||
                            '—'}
                    </strong>
                </div>

                <div className="summary-item highlight">
                    <span>
                        Montant
                    </span>

                    <strong>
                        {formatAmount()}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        Frais
                    </span>

                    <strong>
                        {transfer.fees ||
                            'SHA'}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        Bénéficiaire
                    </span>

                    <strong>
                        {beneficiary?.name ||
                            transfer.beneficiary_name ||
                            '—'}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        IBAN
                    </span>

                    <strong>
                        {beneficiary?.iban ||
                            transfer.beneficiary_iban ||
                            '—'}
                    </strong>
                </div>

                <div className="summary-item">
                    <span>
                        SWIFT
                    </span>

                    <strong>
                        {beneficiary?.swift ||
                            transfer.beneficiary_swift ||
                            '—'}
                    </strong>
                </div>
            </div>

            {(transfer.purpose ||
                transfer.case_reference) && (
                <div className="transfer-summary-extra">
                    {transfer.purpose && (
                        <div>
                            <span>
                                Motif
                            </span>

                            <p>
                                {transfer.purpose}
                            </p>
                        </div>
                    )}

                    {transfer.case_reference && (
                        <div>
                            <span>
                                Référence dossier
                            </span>

                            <p>
                                {
                                    transfer.case_reference
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TransferSummary;