import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Banks from "./pages/Banks/Banks";
import Beneficiaries from "./pages/Beneficiaries/Beneficiaries";
import Settings from "./pages/Settings/Settings";
import Transfers from "./pages/Transfers/Transfers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/transfers" element={<Transfers />} />

          <Route path="/beneficiaries" element={<Beneficiaries />} />

          <Route path="/banks" element={<Banks />} />

          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
