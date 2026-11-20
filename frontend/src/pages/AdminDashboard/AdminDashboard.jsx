import { useEffect, useState } from 'react';
import { Users, BookOpen, LifeBuoy, Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import { adminApi } from '../../services/admin.js';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { adminApi.dashboard().then(setData).catch((e) => setError(e.message)); }, []);
  return <div className="admin-page">
    <div className="page-head"><div><span className="admin-kicker">Centro de control</span><h1>Dashboard</h1><p>Visión operativa de usuarios, Vera, RAG y soporte.</p></div></div>
    {error && <div className="admin-alert">{error}</div>}
    <AdminRagSummary />
    <div className="admin-stat-grid">
      <AdminStat icon={Users} label="Usuarios" value={data?.users ?? '—'} />
      <AdminStat icon={LifeBuoy} label="Casos abiertos" value={data?.openCases ?? '—'} />
      <AdminStat icon={BookOpen} label="Conocimiento publicado" value={data?.publishedKnowledge ?? '—'} />
      <AdminStat icon={Bot} label="Eventos de Vera" value={data?.veraEvents ?? '—'} />
    </div>
    <div className="dashboard-columns">
      <SectionCard title="Salud operativa de Vera" subtitle="Puntos que el equipo debe vigilar antes de publicar cambios.">
        <div className="health-list">
          <Health icon={BookOpen} title="Base de conocimiento" text="Los documentos administrados desde CRM pueden revisarse y publicarse sin entrar a Drive." ok />
          <Health icon={CheckCircle2} title="Conocimiento publicado" text="El equipo puede revisar, probar y publicar conocimiento para Vera desde el CRM." ok />
          <Health icon={Bot} title="Escalamiento" text="Las preguntas que Vera no puede resolver pueden convertirse en casos de soporte." ok />
        </div>
      </SectionCard>
      <SectionCard title="Acciones rápidas" subtitle="Ir directamente al área de operación.">
        <div className="quick-actions"><a href="/admin/vera"><BookOpen size={17}/><span>Gestionar RAG</span><ArrowRight size={14}/></a><a href="/admin/soporte"><LifeBuoy size={17}/><span>Revisar soporte</span><ArrowRight size={14}/></a><a href="/admin/usuarios"><Users size={17}/><span>Ver usuarios</span><ArrowRight size={14}/></a></div>
      </SectionCard>
    </div>
  </div>;
}
function AdminStat({ icon: Icon, label, value }) { return <div className="card admin-stat"><span><Icon size={19}/></span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function Health({ icon: Icon, title, text, ok }) { return <div className="health-item"><span className={ok ? 'ok' : 'warn'}><Icon size={15}/></span><div><strong>{title}</strong><small>{text}</small></div></div>; }
