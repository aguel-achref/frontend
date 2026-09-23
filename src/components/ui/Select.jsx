function Select({
    label,
    name,
    value = '',
    onChange,
    options = [],
    placeholder = 'Sélectionner...',
    required = false,
    disabled = false,
    error = '',
    hint = '',
    className = '',
}) {
    const selectClasses = [
        'form-select',
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

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={selectClasses}
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => {
                    if (typeof option === 'string') {
                        return (
                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>
                        );
                    }

                    return (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    );
                })}
            </select>

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

export default Select;