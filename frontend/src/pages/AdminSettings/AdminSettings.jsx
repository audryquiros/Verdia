import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import './AdminSettings.css';

export default function AdminSettings() {
  return <div className="admin-simple-page">
    <div className="page-head"><div><h1>Configuración</h1><p>Parámetros administrativos de Verdia.</p></div></div>
    <SectionCard title="Módulo de Configuración" subtitle="Este espacio forma parte del centro administrativo de Verdia.">
      <div className="admin-simple-placeholder">
        <strong>Preparado para el módulo de Configuración.</strong>
        <span>La navegación ya está separada del espacio financiero del usuario.</span>
      </div>
    </SectionCard>
  </div>;
}
