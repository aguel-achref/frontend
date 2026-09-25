import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    {
      to: "/",
      label: "Tableau de bord",
      icon: "▦",
      end: true,
    },
    {
      to: "/transfers",
      label: "Virements",
      icon: "↗",
    },
    {
      to: "/beneficiaries",
      label: "Bénéficiaires",
      icon: "♙",
    },
    {
      to: "/banks",
      label: "Banques",
      icon: "▣",
    },
    {
      to: "/settings",
      label: "Paramètres",
      icon: "⚙",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">LM</div>

        <div>
          <strong>Leo Minor</strong>
          <span>Transfer Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-title">MENU PRINCIPAL</span>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">{link.icon}</span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status-dot" />

        <div>
          <strong>Système opérationnel</strong>
          <span>API connectée</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
