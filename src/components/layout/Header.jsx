import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const titles = {
    "/": "Tableau de bord",
    "/transfers": "Virements",
    "/beneficiaries": "Bénéficiaires",
    "/banks": "Banques",
    "/settings": "Paramètres",
  };

  return (
    <header className="top-header">
      <div>
        <span className="header-breadcrumb">Leo Minor</span>

        <h1>{titles[location.pathname] || "Leo Minor"}</h1>
      </div>

      <div className="header-user">
        <div className="header-user-avatar">LM</div>

        <div>
          <strong>Administration</strong>
          <span>Gestionnaire</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
