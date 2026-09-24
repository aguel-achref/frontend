function AttijariTransferPrint({
    transfer,
    bank,
    settings,
}) {
    return (
        <div className="print-a4 bank-print attijari-print">
            <header className="bank-print-header">
                <div className="attijari-logo-box">
                    A
                </div>

                <div>
                    <strong>Attijari bank</strong>
                    <span>
                        Tunisia
                    </span>
                </div>

                <div className="bank-print-reference">
                    <span>N° de l'ordre</span>
                    <strong>
                        {transfer.reference}
                    </strong>
                </div>
            </header>

            <div className="bank-print-title">
                ORDRE DE VIREMENT
            </div>

            <section className="bank-print-section">
                <h2>Donneur d'ordre</h2>

                <div className="bank-print-grid">
                    <div className="print-span-2">
                        <label>Client</label>
                        <strong>
                            {settings?.company_name}
                        </strong>
                    </div>

                    <div>
                        <label>Compte</label>
                        <strong>
                            {transfer.debit_account}
                        </strong>
                    </div>

                    <div>
                        <label>Date</label>
                        <strong>
                            {transfer.transfer_date}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="bank-print-section">
                <h2>Opération</h2>

                <div className="bank-print-grid">
                    <div>
                        <label>Devise</label>
                        <strong>
                            {transfer.currency}
                        </strong>
                    </div>

                    <div>
                        <label>Montant</label>
                        <strong className="print-amount">
                            {Number(
                                transfer.amount || 0
                            ).toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                            })}
                        </strong>
                    </div>

                    <div>
                        <label>Frais</label>
                        <strong>
                            {transfer.fees}
                        </strong>
                    </div>

                    <div>
                        <label>Cours négocié</label>
                        <strong>
                            {transfer.negotiated_rate || '—'}
                        </strong>
                    </div>

                    <div>
                        <label>Type opération</label>
                        <strong>
                            {transfer.operation_type || '—'}
                        </strong>
                    </div>

                    <div>
                        <label>Référence dossier</label>
                        <strong>
                            {transfer.case_reference || '—'}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="bank-print-section">
                <h2>Bénéficiaire</h2>

                <div className="bank-print-grid">
                    <div className="print-span-2">
                        <label>Nom / raison sociale</label>
                        <strong>
                            {transfer.beneficiary_name}
                        </strong>
                    </div>

                    <div>
                        <label>Pays</label>
                        <strong>
                            {transfer.beneficiary_country}
                        </strong>
                    </div>

                    <div>
                        <label>Ville</label>
                        <strong>
                            {transfer.beneficiary_city}
                        </strong>
                    </div>

                    <div className="print-span-2">
                        <label>IBAN</label>
                        <strong className="print-iban">
                            {transfer.beneficiary_iban}
                        </strong>
                    </div>

                    <div>
                        <label>Banque</label>
                        <strong>
                            {transfer.beneficiary_bank}
                        </strong>
                    </div>

                    <div>
                        <label>SWIFT</label>
                        <strong>
                            {transfer.beneficiary_swift}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="attijari-purpose">
                <label>Motif du virement</label>

                <p>
                    {transfer.purpose || '—'}
                </p>
            </section>

            <div className="print-signatures">
                <div>Signature client</div>
                <div>Signature autorisée</div>
            </div>

            <footer className="bank-print-footer">
                <strong>Attijari bank</strong>

                <span>
                    {settings?.company_name}
                </span>

                <span>
                    Réf. {transfer.reference}
                </span>
            </footer>
        </div>
    );
}

export default AttijariTransferPrint;