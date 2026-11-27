import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing/Landing.jsx';
import Login from '../pages/Login/Login.jsx';
import Register from '../pages/Register/Register.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Movements from '../pages/Movements/Movements.jsx';
import Accounts from '../pages/Accounts/Accounts.jsx';
import Budgets from '../pages/Budgets/Budgets.jsx';
import Cards from '../pages/Cards/Cards.jsx';
import Debts from '../pages/Debts/Debts.jsx';
import Goals from '../pages/Goals/Goals.jsx';
import Services from '../pages/Services/Services.jsx';
import Vera from '../pages/Vera/Vera.jsx';
import MailIntegration from '../pages/MailIntegration/MailIntegration.jsx';
import Settings from '../pages/Settings/Settings.jsx';
import Reports from '../pages/Reports/Reports.jsx';
import Support from '../pages/Support/Support.jsx';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard.jsx';
import AdminUsers from '../pages/AdminUsers/AdminUsers.jsx';
import AdminRag from '../pages/AdminRag/AdminRag.jsx';
import AdminSupport from '../pages/AdminSupport/AdminSupport.jsx';
import AdminMessaging from '../pages/AdminMessaging/AdminMessaging.jsx';
import AdminAudit from '../pages/AdminAudit/AdminAudit.jsx';
import AdminAnalytics from '../pages/AdminAnalytics/AdminAnalytics.jsx';
import AdminProduct from '../pages/AdminProduct/AdminProduct.jsx';
import AdminSecurity from '../pages/AdminSecurity/AdminSecurity.jsx';
import AdminSettings from '../pages/AdminSettings/AdminSettings.jsx';
import AdminAccount from '../pages/AdminAccount/AdminAccount.jsx';
import { getSession } from '../services/auth.js';
import AppShell from '../components/AppShell/AppShell.jsx';
import AdminShell from '../components/AdminShell/AdminShell.jsx';
import { isAuthenticated } from '../services/auth.js';
import { FinanceDataProvider } from '../context/FinanceDataContext.jsx';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  return getSession()?.user?.rol === 'ADMIN' ? children : <Navigate to="/inicio" replace />;
}

function UserRoute({ children }) {
  return getSession()?.user?.rol === 'ADMIN' ? <Navigate to="/admin" replace /> : children;
}

export default function App() {
  return (
    <FinanceDataProvider>
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route element={<ProtectedRoute><UserRoute><AppShell /></UserRoute></ProtectedRoute>}>
        <Route path="/inicio" element={<Dashboard />} />
        <Route path="/movimientos" element={<Movements />} />
        <Route path="/cuentas" element={<Accounts />} />
        <Route path="/presupuestos" element={<Budgets />} />
        <Route path="/tarjetas" element={<Cards />} />
        <Route path="/deudas" element={<Debts />} />
        <Route path="/metas" element={<Goals />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/vera" element={<Vera />} />
        <Route path="/correo" element={<MailIntegration />} />
        <Route path="/ajustes" element={<Settings />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/soporte" element={<Support />} />
      </Route>
      <Route element={<ProtectedRoute><AdminRoute><AdminShell /></AdminRoute></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/analitica" element={<AdminAnalytics />} />
        <Route path="/admin/producto" element={<AdminProduct />} />
        <Route path="/admin/vera" element={<AdminRag />} />
        <Route path="/admin/mensajeria" element={<AdminMessaging />} />
        <Route path="/admin/soporte" element={<AdminSupport />} />
        <Route path="/admin/seguridad" element={<AdminSecurity />} />
        <Route path="/admin/auditoria" element={<AdminAudit />} />
        <Route path="/admin/configuracion" element={<AdminSettings />} />
        <Route path="/admin/cuenta" element={<AdminAccount />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FinanceDataProvider>
  );
}
