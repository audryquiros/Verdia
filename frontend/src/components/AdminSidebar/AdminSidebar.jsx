import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Puzzle, Sparkles, MessageSquare, LifeBuoy, Shield, ClipboardList, ShieldCheck, X } from 'lucide-react';
import sidebarLogo from '../../assets/brand/logos/verdia-sidebar-logo.png';
import './AdminSidebar.css';

const items = [
  ['/admin', 'Dashboard', LayoutDashboard],
  ['/admin/usuarios', 'Usuarios', Users],
  ['/admin/analitica', 'Analítica', BarChart3],
  ['/admin/producto', 'Producto', Puzzle],
  ['/admin/vera', 'Vera / RAG', Sparkles],
  ['/admin/mensajeria', 'Mensajería', MessageSquare],
  ['/admin/soporte', 'Soporte', LifeBuoy],
  ['/admin/seguridad', 'Seguridad', Shield],
  ['/admin/auditoria', 'Auditoría', ClipboardList],
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-vine" aria-hidden="true" />
      <div className="admin-sidebar-head">
        <img className="admin-sidebar-logo" src={sidebarLogo} alt="Verdia" />
        <button className="admin-mobile-close" onClick={onClose} aria-label="Cerrar menú"><X size={19} /></button>
      </div>

      <div className="admin-console-badge">
        <span className="admin-console-icon"><ShieldCheck size={18} /></span>
        <div><strong>ADMIN</strong><span>Centro de control</span></div>
      </div>

      <div className="admin-nav-label">Administración</div>
      <nav className="admin-nav" aria-label="Administración de Verdia">
        {items.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/admin'} onClick={onClose} className={({ isActive }) => `admin-side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-status">
        <span className="admin-status-dot" />
        <div><strong>Operación protegida</strong><small>Acceso administrativo activo</small></div>
      </div>
    </aside>
  );
}
