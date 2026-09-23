function TransferSection({
    number,
    title,
    description = '',
    children,
    className = '',
}) {
    return (
        <section
            className={`transfer-section ${className}`}
        >
            <div className="transfer-section-header">
                <div className="transfer-section-number">
                    {number}
                </div>

                <div>
                    <h3>{title}</h3>

                    {description && (
                        <p>{description}</p>
                    )}
                </div>
            </div>

            <div className="transfer-section-content">
                {children}
            </div>
        </section>
    );
}

export default TransferSection;