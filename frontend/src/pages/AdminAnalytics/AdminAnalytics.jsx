import { useEffect, useState } from 'react';
import { MessageCircle, FileSearch, LifeBuoy, Database } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import { adminApi } from '../../services/admin.js';
import './AdminAnalytics.css';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  useEffect(() => { adminApi.ragOverview().then(setData).catch(() => {}); }, []);
  return <div className="admin-page">
    <div className="page-head"><div><h1>Analítica</h1><p>Uso del producto, Vera, recuperación de conocimiento y soporte.</p></div></div>
    <AdminRagSummary />
    <div className="analytics-grid">
      <Metric title="Mensajes de Vera" value={data?.veraMessages ?? '—'} icon={MessageCircle} note="Mensajes registrados con rol VERA" />
      <Metric title="Fuentes utilizadas" value={data?.sourcesUsed ?? '—'} icon={FileSearch} note="Fuentes asociadas a mensajes" />
      <Metric title="Casos originados por Vera" value={data?.support?.veraCases ?? '—'} icon={LifeBuoy} note="Escalaciones desde Vera" />
      <Metric title="Versiones documentales" value={data?.versions ?? '—'} icon={Database} note="Versiones almacenadas" />
    </div>
    <div className="analytics-columns">
      <SectionCard title="Embudo de conocimiento" subtitle="Qué debe observar el equipo para mejorar Vera.">
        <div className="analytics-list">
          <Row label="Documentos disponibles" value={data?.documents?.total ?? '—'} />
          <Row label="Documentos publicados" value={data?.documents?.published ?? '—'} />
          <Row label="Documentos en borrador" value={data?.documents?.draft ?? '—'} />
          <Row label="Fragmentos recuperables" value={data?.fragments ?? '—'} />
        </div>
      </SectionCard>
      <SectionCard title="Señales de calidad" subtitle="Indicadores base para futuras métricas de RAG.">
        <div className="quality-grid">
          <div><strong>Recuperación</strong><span>{data?.retrieval?.engine || '—'}</span></div>
          <div><strong>Embeddings</strong><span>{data?.embeddings?.status || '—'}</span></div>
          <div><strong>Ingesta</strong><span>PDF · DOCX · TXT · MD · JSON</span></div>
          <div><strong>Límite</strong><span>{data?.ingestion?.maxFileSizeMb || 10} MB por archivo</span></div>
        </div>
      </SectionCard>
    </div>
  </div>;
}
function Metric({ title, value, icon: Icon, note }) { return <div className="card analytics-metric"><span><Icon size={18}/></span><div><small>{title}</small><strong>{value}</strong><em>{note}</em></div></div>; }
function Row({ label, value }) { return <div className="analytics-row"><span>{label}</span><strong>{value}</strong></div>; }
