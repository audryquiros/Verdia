import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ArrowLeftRight, WalletCards, CreditCard, HandCoins, Target, ReceiptText, BarChart3, Bot, Settings, X, LogOut } from 'lucide-react';
import { logout } from '../../services/auth.js';
import sidebarLogo from '../../assets/brand/logos/verdia-sidebar-logo.png';
import './Sidebar.css';

const items = [
  ['/inicio', 'Inicio', Home],
  ['/movimientos', 'Movimientos', ArrowLeftRight],
  ['/presupuestos', 'Presupuestos', WalletCards],
  ['/tarjetas', 'Tarjetas', CreditCard],
  ['/deudas', 'Deudas', HandCoins],
  ['/metas', 'Metas de ahorro', Target],
  ['/servicios', 'Pagos de servicios', ReceiptText],
  ['/reportes', 'Reportes', BarChart3],
  ['/vera', 'Vera', Bot],
  ['/ajustes', 'Ajustes', Settings],
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    onClose?.();
    navigate('/login', { replace: true });
  }

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-vine" aria-hidden="true" />

      <div className="sidebar-head">
        <img className="sidebar-logo" src={sidebarLogo} alt="Verdia" />
        <button className="mobile-close" onClick={onClose} aria-label="Cerrar menú">
          <X size={19} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="vera-mini">
          <Bot size={20} />
          <div>
            <strong>Vera</strong>
            <small>Tu asistente financiera</small>
          </div>
        </div>

        <button className="sidebar-logout" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
