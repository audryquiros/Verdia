import { useState } from 'react';
import { Check, PenLine, X, Send } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import { queryRag } from '../../services/rag.js';
import './Vera.css';

const VERA_IMAGES = {
  ready: '/vera-robot-saludando.png',
  // Cuando agreguemos estos dos assets al /public, Vera cambiará de imagen según su estado.
  thinking: '/vera-robot-pensando.png',
  analyzing: '/vera-robot-analizando.png',
};

function getVeraImage(status) {
  return VERA_IMAGES[status] || VERA_IMAGES.ready;
}

const examples = [
  '¿Cuánto gasté este mes?',
  '¿En qué estoy gastando más?',
  'Gasté ₡8.000 en comida',
];

export default function Vera() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [veraStatus, setVeraStatus] = useState('ready');
  const [error, setError] = useState('');
  const [proposalState, setProposalState] = useState(null);

  function looksLikeExpense(text) {
    return /gast[éeo]|compr[éeo]|pag[ué]|comida|aliment/i.test(text);
  }

  async function askVera(event) {
    event.preventDefault();
    const text = query.trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setQuery('');
    setError('');
    setProposalState(null);
    setLoading(true);
    setVeraStatus('thinking');

    const analyzingTimer = window.setTimeout(() => setVeraStatus('analyzing'), 650);

    try {
      const result = await queryRag({
        spaceId: import.meta.env.VITE_DEFAULT_SPACE_ID || '900001',
        query: text,
        limit: 5,
      });

      setMessages((current) => [
        ...current,
        {
          role: 'vera',
          text: result.answer || 'Puedo ayudarte con esa consulta.',
          proposal: looksLikeExpense(text),
        },
      ]);

      if (looksLikeExpense(text)) setProposalState('pending');
      if (result.needsSupport) setError('No encontré suficiente información para responder con seguridad.');
    } catch (err) {
      setError(err.message || 'No fue posible consultar la información de Vera.');
    } finally {
      window.clearTimeout(analyzingTimer);
      setLoading(false);
      setVeraStatus('ready');
    }
  }

  function useExample(example) {
    setQuery(example);
    setError('');
  }

  function handleProposalAction(action) {
    setProposalState(action);
  }

  const showWelcome = messages.length === 0 && !loading && !error;

  return (
    <div className="vera-page">
      <PageHeader />

      <main className="vera-layout">
        <section className="vera-chat-card card">
          <div className="vera-conversation">
            {showWelcome && (
              <div className="vera-welcome">
                <div className="vera-welcome-visual">
                  <img
                    src={getVeraImage(veraStatus)}
                    alt="Vera"
                    onError={(event) => { event.currentTarget.src = VERA_IMAGES.ready; }}
                  />
                </div>
                <div className="vera-welcome-copy">
                  <div>
                    <strong>¿En qué te ayudo?</strong>
                    <p>Puedo ayudarte a entender tus finanzas y preparar propuestas para que tú decidas.</p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'user' ? 'vera-message-row user' : 'vera-message-row vera'}>
                {message.role === 'vera' && (
                  <div className="vera-mini-avatar">
                    <img
                    src={getVeraImage(veraStatus)}
                    alt=""
                    onError={(event) => { event.currentTarget.src = VERA_IMAGES.ready; }}
                  />
                  </div>
                )}
                <div className={message.role === 'user' ? 'vera-user-message' : 'vera-answer'}>
                  {message.role === 'vera' && <strong>Vera</strong>}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="vera-message-row vera">
                <div className="vera-mini-avatar">
                  <img
                    src={getVeraImage(veraStatus)}
                    alt=""
                    onError={(event) => { event.currentTarget.src = VERA_IMAGES.ready; }}
                  />
                </div>
                <div className="vera-loading">
                  <span>Estoy revisando la información…</span>
                  <div className="vera-dots"><i /><i /><i /></div>
                </div>
              </div>
            )}

            {messages.some((message) => message.proposal) && proposalState && (
              <div className="vera-proposal">
                <div className="vera-proposal-copy">
                  <span className="vera-proposal-label">¡Listo! Preparé el movimiento:</span>
                  <ul>
                    <li><b>Monto:</b> ₡8.000</li>
                    <li><b>Categoría:</b> Alimentación</li>
                  </ul>
                  {proposalState === 'pending' && <p className="vera-question">¿Deseas registrarlo?</p>}
                  {proposalState === 'confirmed' && <p className="vera-state-success">Propuesta confirmada. El registro real se conectará después.</p>}
                  {proposalState === 'edited' && <p className="vera-state-info">La propuesta quedó lista para editar.</p>}
                  {proposalState === 'cancelled' && <p className="vera-state-cancelled">Cancelado. No se realizó ningún cambio.</p>}
                </div>
                {proposalState === 'pending' && (
                  <div className="vera-actions">
                    <button className="btn btn-primary" type="button" onClick={() => handleProposalAction('confirmed')}>
                      <Check size={15} /> Confirmar
                    </button>
                    <button className="btn btn-outline" type="button" onClick={() => handleProposalAction('edited')}>
                      <PenLine size={15} /> Editar
                    </button>
                    <button className="btn btn-danger" type="button" onClick={() => handleProposalAction('cancelled')}>
                      <X size={15} /> Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="vera-error-message">
                <strong>No pude completar la consulta.</strong>
                <span>{error}</span>
              </div>
            )}
          </div>

          {showWelcome && (
            <div className="vera-examples">
              <span>Prueba con:</span>
              {examples.map((example) => (
                <button key={example} type="button" onClick={() => useExample(example)}>{example}</button>
              ))}
            </div>
          )}

          <form className="vera-input" onSubmit={askVera}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Escribe un mensaje a Vera…"
              aria-label="Escribir un mensaje a Vera"
            />
            <button type="submit" disabled={loading || !query.trim()} aria-label="Enviar mensaje">
              <Send size={18} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
