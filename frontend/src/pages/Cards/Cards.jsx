import { useState } from 'react';
import { Plus, Eye, ArrowRight, CreditCard, List, LayoutGrid } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import './Cards.css';

const CARD_DESIGNS = {
  VISA: { className: 'card-brand-visa', label: 'VISA' },
  MASTERCARD: { className: 'card-brand-mastercard', label: 'MASTERCARD' },
  AMERICAN_EXPRESS: { className: 'card-brand-amex', label: 'AMERICAN EXPRESS' },
  DISCOVER: { className: 'card-brand-discover', label: 'DISCOVER' },
  DEFAULT: { className: 'card-brand-default', label: 'CARD' },
};

function getCardDesign(brand) {
  const normalized = String(brand || '').trim().toUpperCase().replace(/\s+/g, '_');
  return CARD_DESIGNS[normalized] || CARD_DESIGNS.DEFAULT;
}

const formatMoney = (value) => `₡${Number(value).toLocaleString('es-CR')}`;

function CreditCardVisual({ card, compact = false }) {
  const design = getCardDesign(card.marca);

  return (
    <div className={`credit-card ${design.className} ${compact ? 'credit-card--compact' : ''}`}>
      <div className="credit-card__decoration" aria-hidden="true" />
      <div className="credit-card__top">
        <span className="credit-card__brand">{design.label}</span>
        <span className="credit-card__type">{card.tipo}</span>
      </div>
      <strong className="credit-card__number">•••• {card.ultimosCuatro}</strong>
      <div className="card-bottom">
        <span>
          <small>Saldo pendiente</small>
          <b>{formatMoney(card.saldoPendiente)}</b>
        </span>
        <span>
          <small>Vencimiento</small>
          <b>{card.fechaVencimiento}</b>
        </span>
      </div>
    </div>
  );
}

function CardInfo({ card, showActions = true }) {
  return (
    <div className="card-info">
      <div className="card-info__rows">
        <div className="detail-row">
          <span>Fecha de corte</span>
          <b>{card.fechaCorte}</b>
        </div>
        <div className="detail-row">
          <span>Pago total</span>
          <b>{formatMoney(card.saldoPendiente)}</b>
        </div>
        <div className="detail-row">
          <span>Pago mínimo</span>
          <b>{formatMoney(card.pagoMinimo)}</b>
        </div>
      </div>

      {showActions && (
        <div className="actions">
          <button className="btn btn-outline">
            <Eye size={15} /> Ver movimientos
          </button>
          <button className="btn btn-primary">
            Pagar tarjeta <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function WalletView({ card }) {
  return (
    <section className="wallet-view">
      <div className="wallet-card-shell">
        <CreditCardVisual card={card} />
        <CardInfo card={card} />
      </div>
    </section>
  );
}

function CardsView({ cards }) {
  return (
    <section className="cards-view">
      {cards.map((card) => (
        <article className="card-format" key={`${card.marca}-${card.ultimosCuatro}`}>
          <CreditCardVisual card={card} />
          <CardInfo card={card} />
        </article>
      ))}
    </section>
  );
}

function ListView({ cards }) {
  return (
    <section className="list-view">
      <div className="cards-list-head">
        <span>Tarjeta</span>
        <span>Saldo pendiente</span>
        <span>Vencimiento</span>
        <span>Acciones</span>
      </div>

      {cards.map((card) => {
        const design = getCardDesign(card.marca);
        return (
          <article className="card-list-row" key={`${card.marca}-${card.ultimosCuatro}`}>
            <div className="card-list-identity">
              <span className={`card-list-mark ${design.className}`}>{design.label}</span>
              <div>
                <strong>•••• {card.ultimosCuatro}</strong>
                <span>{card.tipo} · Corte {card.fechaCorte}</span>
              </div>
            </div>
            <strong>{formatMoney(card.saldoPendiente)}</strong>
            <span>{card.fechaVencimiento}</span>
            <div className="card-list-actions">
              <button className="btn btn-outline"><Eye size={14} /> Ver</button>
              <button className="btn btn-primary">Pagar</button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default function Cards() {
  const [view, setView] = useState('wallet');

  // La estructura queda preparada para múltiples tarjetas cuando lleguen desde la API.
  const cards = [
    {
      marca: 'VISA',
      tipo: 'Crédito',
      ultimosCuatro: '1234',
      saldoPendiente: 120000,
      pagoMinimo: 12000,
      fechaCorte: '25 nov',
      fechaVencimiento: '05 dic',
    },
  ];

  const activeCard = cards[0];

  return (
    <div className="simple-page cards-page">
      <PageHeader />

      <div className="cards-toolbar">
        <button className="btn btn-primary cards-register-btn"><Plus size={16} /> Registrar tarjeta</button>
        <div className="cards-view-switcher" role="tablist" aria-label="Vista de tarjetas">
          <button
            className={view === 'wallet' ? 'active' : ''}
            onClick={() => setView('wallet')}
            role="tab"
            aria-selected={view === 'wallet'}
            title="Vista wallet"
          >
            <CreditCard size={16} /> Wallet
          </button>
          <button
            className={view === 'cards' ? 'active' : ''}
            onClick={() => setView('cards')}
            role="tab"
            aria-selected={view === 'cards'}
            title="Vista cards"
          >
            <LayoutGrid size={16} /> Cards
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
            role="tab"
            aria-selected={view === 'list'}
            title="Vista lista"
          >
            <List size={16} /> Lista
          </button>
        </div>
      </div>

      {view === 'wallet' && <WalletView card={activeCard} />}
      {view === 'cards' && <CardsView cards={cards} />}
      {view === 'list' && <ListView cards={cards} />}
    </div>
  );
}
