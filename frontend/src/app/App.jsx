import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing/Landing.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Movements from '../pages/Movements/Movements.jsx';
import Budgets from '../pages/Budgets/Budgets.jsx';
import Cards from '../pages/Cards/Cards.jsx';
import Debts from '../pages/Debts/Debts.jsx';
import Goals from '../pages/Goals/Goals.jsx';
import Services from '../pages/Services/Services.jsx';
import Vera from '../pages/Vera/Vera.jsx';
import MailIntegration from '../pages/MailIntegration/MailIntegration.jsx';
import Settings from '../pages/Settings/Settings.jsx';
import Reports from '../pages/Reports/Reports.jsx';
import AppShell from '../components/AppShell/AppShell.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<AppShell />}>
        <Route path="/inicio" element={<Dashboard />} />
        <Route path="/movimientos" element={<Movements />} />
        <Route path="/presupuestos" element={<Budgets />} />
        <Route path="/tarjetas" element={<Cards />} />
        <Route path="/deudas" element={<Debts />} />
        <Route path="/metas" element={<Goals />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/vera" element={<Vera />} />
        <Route path="/correo" element={<MailIntegration />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/reportes" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
