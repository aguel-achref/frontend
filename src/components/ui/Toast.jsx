function Toast({
    message,
    type = 'success',
    onClose,
}) {
    if (!message) {
        return null;
    }

    const icons = {
        success: '✓',
        error: '!',
        warning: '!',
        info: 'i',
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {icons[type] || 'i'}
            </div>

            <div className="toast-message">
                {message}
            </div>

            {onClose && (
                <button
                    type="button"
                    className="toast-close"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default Toast;