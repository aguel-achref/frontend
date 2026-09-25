function Badge({ children, variant = "default", size = "medium" }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>{children}</span>
  );
}

export default Badge;
