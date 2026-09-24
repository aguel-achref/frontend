function BiatTransferPrint({
    transfer,
    bank,
    settings,
}) {
    return (
        <div className="print-a4 bank-print biat-print">
            <header className="bank-print-header">
                <div className="bank-logo-box">
                    BIAT
                </div>

                <div>
                    <strong>BIAT</strong>
                    <span>
                        Banque Internationale Arabe de Tunisie
                    </span>
                </div>

                <div className="bank-print-reference">
                    <span>Référence</span>
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
                    <div>
                        <label>Raison sociale</label>
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
                        <label>Adresse</label>
                        <strong>
                            {settings?.address}
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
                <h2>Instruction de paiement</h2>

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
                        <label>Motif</label>
                        <strong>
                            {transfer.purpose || '—'}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="bank-print-section">
                <h2>Bénéficiaire</h2>

                <div className="bank-print-grid">
                    <div>
                        <label>Nom</label>
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

                    <div className="print-span-2">
                        <label>Adresse</label>
                        <strong>
                            {transfer.beneficiary_address}
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

            <div className="print-signatures biat-signatures">
                <div>Signature du client</div>
                <div>Validation banque</div>
                <div>Cachet</div>
                <div>Date</div>
            </div>

            <footer className="bank-print-footer">
                <strong>BIAT</strong>

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

export default BiatTransferPrint;