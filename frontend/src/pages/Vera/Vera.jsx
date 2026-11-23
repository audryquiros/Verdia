import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Check, PenLine, X, Send, FileText } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import { queryRag } from '../../services/rag.js';
import './Vera.css';

export default function Vera() {
  const [query, setQuery] = useState('¿Qué información tienes en tus documentos?');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function askVera(event) {
    event.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError('');
    try {
      const result = await queryRag({
        spaceId: import.meta.env.VITE_DEFAULT_SPACE_ID || '900001',
        query,
        limit: 5,
      });
      setAnswer(result.answer);
      setSources(result.sources || []);
      if (result.needsSupport) setError('No encontré suficiente información en la base de conocimiento.');
    } catch (err) {
      setError(err.message || 'No fue posible consultar el RAG.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vera-page">
      <PageHeader />

      <div className="vera-layout">
        <SectionCard title="Vera con conocimiento documental" subtitle="Google Drive + MySQL">
          <div className="vera-large">
            <div className="vera-large-bot"><Bot size={54} /></div>
            <div className="proposal">
              <span>Consulta tus documentos</span>
              <strong>{answer || 'Haz una pregunta para probar el RAG.'}</strong>
              {loading && <p className="vera-status">Consultando documentos…</p>}
              {error && <p className="vera-error">{error}</p>}
              {!loading && sources.length === 0 && answer && <Link className="btn btn-outline vera-support-link" to="/soporte">Contactar soporte</Link>}
              {sources.length > 0 && (
                <div className="vera-sources">
                  <span>Fuentes recuperadas</span>
                  {sources.map((source, index) => (
                    <div className="vera-source" key={source.id || index}>
                      <FileText size={15} />
                      <div><strong>{source.title}</strong><small>{source.uri || 'Documento en Google Drive'}</small></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Escribe a Vera">
          <form className="chat-input" onSubmit={askVera}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pregunta sobre tus documentos..." />
            <button type="submit" disabled={loading}><Send size={17} /></button>
          </form>
        </SectionCard>

        <SectionCard title="Propuesta de Vera" subtitle="La consulta documental no ejecuta acciones financieras">
          <div className="vera-actions">
            <button className="btn btn-primary"><Check size={15}/> Confirmar</button>
            <button className="btn btn-outline"><PenLine size={15}/> Editar</button>
            <button className="btn btn-danger"><X size={15}/> Cancelar</button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
