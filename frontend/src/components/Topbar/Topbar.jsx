import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, UserRound, Settings, LogOut } from 'lucide-react';
import { getSession, logout } from '../../services/auth.js';
import './Topbar.css';

const sectionInfo = {
  '/inicio': ['Resumen', ''],
  '/movimientos': ['Movimientos', 'Registra y revisa lo que realmente ocurrió.'],
  '/presupuestos': ['Presupuestos', 'Controla tus límites y tu progreso.'],
  '/tarjetas': ['Tarjetas', 'Mantén tus tarjetas y pagos bajo control.'],
  '/deudas': ['Deudas', 'Administra lo que debes y lo que te deben.'],
  '/metas': ['Metas de ahorro', 'Acompaña tus objetivos paso a paso.'],
  '/servicios': ['Pagos de servicios', 'Organiza tus pagos recurrentes.'],
  '/reportes': ['Reportes', 'Entiende cómo se mueve tu dinero.'],
  '/vera': ['Vera', 'Tu asistente financiera.'],
  '/ajustes': ['Ajustes', 'Personaliza tu experiencia en Verdia.'],
  '/correo': ['Integración con correo', 'Revisa las conexiones de tu correo.'],
  '/soporte': ['Soporte', 'Ayuda cuando Vera no tenga suficiente información.'],
  '/admin': ['Administración', 'Operación de Verdia y Vera.'],
  '/admin/usuarios': ['Usuarios', 'Vista operativa mínima.'],
  '/admin/vera': ['Vera / RAG', 'Gestiona el conocimiento de Vera.'],
  '/admin/soporte': ['Soporte admin', 'Atiende solicitudes de usuarios.'],
  '/admin/auditoria': ['Auditoría', 'Revisa acciones administrativas sensibles.'],
};

export default function Topbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const session = getSession();
  const user = session?.user;
  const displayName = [user?.nombre, user?.apellido].filter(Boolean).join(' ') || 'Usuario Verdia';
  const initials = displayName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const avatarUrl = user?.foto_url || null;
  const [title, subtitle] = sectionInfo[location.pathname] || ['Verdia', 'Tu espacio financiero.'];
  const currentDate = new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  useEffect(() => {
    function handleOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Abrir menú">
        <Menu size={21} />
      </button>

      <div className="top-context">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <div className="topbar-spacer" />
      <div className="top-period">{currentDate}</div>
      <button className="icon-btn" aria-label="Notificaciones">
        <Bell size={18} />
      </button>

      <div className="user-menu-wrap" ref={menuRef}>
        <button
          className={`user-trigger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label={`Abrir menú de ${displayName}`}
        >
          <span className="avatar-wrap">
            <span className="avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
            </span>
            <span className="avatar-name">{displayName}</span>
          </span>
          <ChevronDown className="avatar-chevron" size={15} />
        </button>

        {menuOpen && (
          <div className="user-dropdown">
            <div className="dropdown-head">
              <div className="avatar large">{avatarUrl ? <img src={avatarUrl} alt="" /> : initials}</div>
              <div>
                <strong>{displayName}</strong>
                <span>{user?.email || 'Cuenta Verdia'}</span>
              </div>
            </div>
            <div className="dropdown-divider" />
            <button onClick={() => { setMenuOpen(false); navigate('/ajustes'); }}>
              <UserRound size={17} />
              <span>Mi perfil</span>
            </button>
            <button onClick={() => { setMenuOpen(false); navigate('/ajustes'); }}>
              <Settings size={17} />
              <span>Configuración</span>
            </button>
            <div className="dropdown-divider" />
            <button className="logout-item" onClick={handleLogout}>
              <LogOut size={17} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
