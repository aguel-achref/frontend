function EmptyState({
    icon = '○',
    title = 'Aucun élément',
    description = '',
    action = null,
}) {
    return (
        <div className="empty-state">
            <div className="empty-state-icon">
                {icon}
            </div>

            <h4>
                {title}
            </h4>

            {description && (
                <p>
                    {description}
                </p>
            )}

            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}
        </div>
    );
}

export default EmptyState;