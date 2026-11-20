import { useEffect, useState } from 'react';
import { Upload, BookOpen, CheckCircle2, Ban, FileText, Search } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import { adminApi } from '../../services/admin.js';
import AdminRagSummary from '../../components/AdminRagSummary/AdminRagSummary.jsx';
import './AdminRag.css';

export default function AdminRag() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);

  async function load() {
    try { setDocuments((await adminApi.documents()).documents || []); }
    catch (e) { setMessage(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function upload() {
    if (!file) return;
    setLoading(true); setMessage('');
    try {
      const base64 = await readBase64(file);
      await adminApi.uploadDocument({ fileName: file.name, mimeType: file.type, base64, title: title || file.name, description });
      setMessage('Documento procesado y listo para revisión.');
      setFile(null); setTitle(''); setDescription('');
      await load();
    } catch (e) { setMessage(e.message); }
    finally { setLoading(false); }
  }

  async function changeState(doc) {
    try {
      if (doc.estado === 'PUBLICADO') await adminApi.unpublishDocument(doc.id);
      else await adminApi.publishDocument(doc.id);
      await load();
    } catch (e) { setMessage(e.message); }
  }

  async function testRag() {
    if (!query.trim()) return;
    setQueryLoading(true); setMessage('');
    try {
      const data = await adminApi.ragQuery(query.trim(), 5);
      setResults(data.sources || []);
    } catch (e) { setMessage(e.message); }
    finally { setQueryLoading(false); }
  }

  return <div className="admin-page">
    <div className="page-head"><div><span className="admin-kicker">Vera / conocimiento</span><h1>Base de conocimiento RAG</h1><p>Sube, revisa, publica y prueba el conocimiento que Vera puede consultar.</p></div></div>
    <AdminRagSummary />

    <SectionCard title="Agregar conocimiento" subtitle="Carga documentos directamente desde el CRM. Los nuevos documentos quedan en borrador hasta que el admin los publique.">
      <div className="rag-upload">
        <label className="rag-file"><Upload size={18}/><span>{file ? file.name : 'Seleccionar archivo'}</span><small>PDF · DOCX · TXT · MD · JSON · máximo 10 MB</small><input type="file" accept=".pdf,.docx,.txt,.md,.json" onChange={(e) => setFile(e.target.files?.[0] || null)}/></label>
        <div className="rag-form"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del documento"/><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción opcional"/><button className="btn btn-primary" disabled={!file || loading} onClick={upload}>{loading ? 'Procesando…' : 'Procesar documento'}</button></div>
      </div>
      {message && <p className="rag-message">{message}</p>}
    </SectionCard>

    <SectionCard title="Probar recuperación RAG" subtitle="La consulta se ejecuta contra el conocimiento global PUBLICADO y muestra los fragmentos realmente recuperados de la base documental.">
      <div className="rag-query-input"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') testRag(); }} placeholder="Escribe una pregunta para probar Vera…"/><button className="btn btn-primary btn-sm" disabled={!query.trim() || queryLoading} onClick={testRag}>{queryLoading ? 'Buscando…' : 'Buscar'}</button></div>
      {results.length > 0 && <div className="rag-results">{results.map((item, index) => <div className="rag-result" key={item.id}><div><strong>{index + 1}. {item.title}</strong><small>Fragmento {item.fragmentIndex ?? index}</small></div><p>{item.content}</p></div>)}</div>}
      {query && !queryLoading && !results.length && <div className="rag-no-results">No se recuperaron fragmentos publicados para esta consulta.</div>}
    </SectionCard>

    <SectionCard title="Documentos" subtitle="Estado real de los documentos administrados desde el CRM.">
      <div className="rag-table">{documents.map(doc => <div className="rag-row" key={doc.id}><div className="rag-doc-icon"><FileText size={18}/></div><div className="rag-doc-main"><strong>{doc.nombre}</strong><span>{doc.descripcion || 'Sin descripción'}</span><small>v{doc.latestVersion || 1} · {doc.fragmentCount || 0} fragmentos · {doc.latestSizeBytes ? `${Math.round(doc.latestSizeBytes / 1024)} KB` : 'tamaño no disponible'}</small></div><span className={`rag-status ${doc.estado.toLowerCase()}`}>{doc.estado}</span><div className="rag-actions">{doc.estado === 'PUBLICADO' ? <button className="btn btn-outline btn-sm" onClick={() => changeState(doc)}><Ban size={14}/> Despublicar</button> : <button className="btn btn-soft btn-sm" onClick={() => changeState(doc)}><CheckCircle2 size={14}/> Publicar</button>}</div></div>)}{!documents.length && <div className="rag-empty"><BookOpen size={25}/><span>No hay documentos administrados desde el CRM.</span></div>}</div>
    </SectionCard>
  </div>;
}

function readBase64(file) { return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(',')[1]); r.onerror = reject; r.readAsDataURL(file); }); }
