import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ArrowLeftRight, Wallet, WalletCards, CreditCard, HandCoins, Target, ReceiptText, BarChart3, Bot, X } from 'lucide-react';
import sidebarLogo from '../../assets/brand/logos/verdia-sidebar-logo.png';
import './Sidebar.css';

const items = [
  ['/inicio', 'Inicio', Home],
  ['/movimientos', 'Movimientos', ArrowLeftRight],
  ['/cuentas', 'Cuentas', Wallet],
  ['/presupuestos', 'Presupuestos', WalletCards],
  ['/tarjetas', 'Tarjetas', CreditCard],
  ['/deudas', 'Deudas', HandCoins],
  ['/metas', 'Metas de ahorro', Target],
  ['/servicios', 'Pagos de servicios', ReceiptText],
  ['/reportes', 'Reportes', BarChart3],
  ['/vera', 'Vera', Bot],
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-vine" aria-hidden="true" />
      <div className="sidebar-head">
        <img className="sidebar-logo" src={sidebarLogo} alt="Verdia" />
        <button className="mobile-close" onClick={onClose} aria-label="Cerrar menú"><X size={19} /></button>
      </div>
      <nav className="sidebar-nav" aria-label="Navegación principal">
        {items.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
