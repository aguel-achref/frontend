function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon = null,
    onClick,
    className = '',
}) {
    const classes = [
        'button',
        `button-${variant}`,
        `button-${size}`,
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <>
                    <span className="button-spinner" />
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    {icon && (
                        <span className="button-icon">
                            {icon}
                        </span>
                    )}

                    <span>{children}</span>
                </>
            )}
        </button>
    );
}

export default Button;