import { useState } from 'react';
import { Bot, ChevronDown, Send, X, FileText } from 'lucide-react';
import { queryRag } from '../../services/rag.js';
import './RagChatWidget.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Hola, soy Vera. Puedes preguntarme algo sobre los documentos que conectemos a Google Cloud RAG.',
};

export default function RagChatWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setQuery('');
    setLoading(true);

    try {
      const result = await queryRag({ spaceId: 'demo', query: trimmed, limit: 5 });
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.answer || 'No encontré una respuesta con el contexto disponible.',
          sources: result.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'error',
          content: error.message || 'No pude conectar con el servicio RAG.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rag-widget">
      {open && (
        <section className="rag-panel" aria-label="Chat de prueba de Vera">
          <header className="rag-panel-header">
            <div className="rag-brand">
              <div className="rag-avatar"><Bot size={19} /></div>
              <div>
                <strong>Vera</strong>
                <span>Prueba de RAG · Google Cloud</span>
              </div>
            </div>
            <button className="rag-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </header>

          <div className="rag-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rag-message rag-message-${message.role}`}>
                <div className="rag-bubble">{message.content}</div>
                {message.sources?.length > 0 && (
                  <div className="rag-source-list">
                    <span>Fuentes</span>
                    {message.sources.slice(0, 3).map((source, sourceIndex) => (
                      <div className="rag-source" key={source.id || sourceIndex}>
                        <FileText size={13} />
                        <span>{source.title || 'Documento'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="rag-message rag-message-assistant">
                <div className="rag-bubble rag-loading">Consultando Google Cloud…</div>
              </div>
            )}
          </div>

          <form className="rag-composer" onSubmit={handleSubmit}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pregunta sobre tus documentos…"
              aria-label="Pregunta a Vera"
            />
            <button type="submit" disabled={loading || !query.trim()} aria-label="Enviar pregunta">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      {!open && (
        <button className="rag-launcher" type="button" onClick={() => setOpen(true)} aria-label="Abrir chat de prueba de Vera">
          <Bot size={23} />
          <span>Probar Vera</span>
        </button>
      )}

      {open && (
        <button className="rag-collapse" type="button" onClick={() => setOpen(false)} aria-label="Minimizar chat">
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
