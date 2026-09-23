function Input({
    label,
    name,
    value = '',
    onChange,
    placeholder = '',
    type = 'text',
    required = false,
    disabled = false,
    readOnly = false,
    error = '',
    hint = '',
    className = '',
    ...props
}) {
    const inputClasses = [
        'form-input',
        error ? 'input-error' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="form-field">
            {label && (
                <label htmlFor={name}>
                    {label}

                    {required && (
                        <span className="required-mark">
                            *
                        </span>
                    )}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={inputClasses}
                {...props}
            />

            {error && (
                <span className="form-error">
                    {error}
                </span>
            )}

            {!error && hint && (
                <span className="form-hint">
                    {hint}
                </span>
            )}
        </div>
    );
}

export default Input;