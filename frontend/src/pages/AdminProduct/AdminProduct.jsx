import { BookOpen, FilePlus2, GitBranch, Search, ArrowRight } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import './AdminProduct.css';

export default function AdminProduct() {
  return <div className="admin-page">
    <div className="page-head"><div><h1>Producto</h1><p>Controla la experiencia de Verdia y la evolución de Vera.</p></div></div>
    <AdminRagSummary />
    <div className="product-grid">
      <SectionCard title="Vera / Base de conocimiento" subtitle="Operación del conocimiento que alimenta las respuestas de Vera.">
        <div className="product-module-grid">
          <Module icon={BookOpen} title="Documentos RAG" text="Gestiona archivos, versiones, estados y publicación." href="/admin/vera" />
          <Module icon={FilePlus2} title="Ingesta" text="Carga conocimiento directamente desde el CRM." href="/admin/vera" />
          <Module icon={GitBranch} title="Versionado" text="Conserva versiones para mantener trazabilidad." href="/admin/vera" />
          <Module icon={Search} title="Pruebas de recuperación" text="Comprueba qué información recupera Vera." href="/admin/vera" />
        </div>
      </SectionCard>
      <SectionCard title="Estado técnico" subtitle="Base actual sobre la que continuaremos construyendo.">
        <div className="product-facts">
          <Fact label="Documentos publicados" value="Se obtiene del estado actual del RAG" />
          <Fact label="Fragmentos" value="Se obtiene de la base documental actual" />
          <Fact label="Fuentes globales" value="CRM_ADMIN / GOOGLE_DRIVE" />
          <Fact label="Tamaño máximo" value="10 MB por archivo" />
          <Fact label="Tipos admitidos" value="PDF, DOCX, TXT, MD, JSON" />
          <Fact label="Control de publicación" value="Borrador → Publicado → Inactivo" />
        </div>
      </SectionCard>
    </div>
    <div className="product-callout"><div><strong>La base de conocimiento es una parte del producto, no una carpeta externa.</strong><span>El admin puede cargar y revisar conocimiento desde Verdia sin entrar a Drive.</span></div><a className="btn btn-primary btn-sm" href="/admin/vera">Abrir RAG <ArrowRight size={14}/></a></div>
  </div>;
}
function Module({ icon: Icon, title, text, href }) { return <a className="product-module" href={href}><span><Icon size={17}/></span><div><strong>{title}</strong><small>{text}</small></div><ArrowRight size={14}/></a>; }
function Fact({ label, value }) { return <div><small>{label}</small><strong>{value}</strong></div>; }
