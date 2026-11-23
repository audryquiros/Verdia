import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { getSession, logout } from '../../services/auth.js';
import './PageHeader.css';

const sectionInfo = {
  '/movimientos': ['Movimientos', 'Registra y controla tus ingresos y gastos.'],
  '/presupuestos': ['Presupuestos', 'Define límites de gasto y controla tu progreso.'],
  '/tarjetas': ['Tarjetas', 'Controla tus tarjetas y sus movimientos.'],
  '/deudas': ['Deudas', 'Administra tus deudas y mantén el control.'],
  '/metas': ['Metas de ahorro', 'Cumple tus objetivos, paso a paso.'],
  '/servicios': ['Pagos de servicios', 'Gestiona tus servicios desde Verdia.'],
  '/reportes': ['Reportes', 'Analiza tus finanzas y toma mejores decisiones.'],
  '/vera': ['Vera ✨', 'Tu asistente financiera.'],
  '/ajustes': ['Ajustes', 'Personaliza tu experiencia en Verdia.'],
  '/correo': ['Integración con correo', 'Revisa las conexiones de tu correo.'],
  '/soporte': ['Soporte', 'Estamos para ayudarte cuando Vera no tenga suficiente información.'],
};

export default function PageHeader({ action = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { onMenu } = useOutletContext() || {};
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
    <header className="page-header">
      <button className="page-header-menu" onClick={onMenu} aria-label="Abrir menú">
        <Menu size={20} />
      </button>

      <div className="page-header-copy">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="page-header-actions">
        {action}
        <span className="page-header-date">{currentDate}</span>
        <button className="page-header-icon" aria-label="Notificaciones">
          <Bell size={18} />
        </button>

        <div className="page-header-user" ref={menuRef}>
          <button
            className={`page-header-user-trigger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label={`Abrir menú de ${displayName}`}
          >
            <span className="page-header-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
            </span>
            <ChevronDown size={15} className="page-header-chevron" />
          </button>

          {menuOpen && (
            <div className="page-header-dropdown">
              <div className="page-header-dropdown-head">
                <div className="page-header-avatar large">
                  {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
                </div>
                <div>
                  <strong>{displayName}</strong>
                  <span>{user?.email || 'Cuenta Verdia'}</span>
                </div>
              </div>
              <div className="page-header-divider" />
              <button onClick={() => { setMenuOpen(false); navigate('/ajustes'); }}>
                <UserRound size={16} />
                <span>Mi perfil</span>
              </button>
              <button onClick={() => { setMenuOpen(false); navigate('/ajustes'); }}>
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <div className="page-header-divider" />
              <button className="logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
