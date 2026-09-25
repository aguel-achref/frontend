function Card({
  children,
  title,
  description,
  action = null,
  padding = true,
  className = "",
}) {
  const classes = ["card", padding ? "card-padding" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {(title || description || action) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3>{title}</h3>}

            {description && <p>{description}</p>}
          </div>

          {action && <div className="card-header-action">{action}</div>}
        </div>
      )}

      <div className="card-body">{children}</div>
    </section>
  );
}

export default Card;
