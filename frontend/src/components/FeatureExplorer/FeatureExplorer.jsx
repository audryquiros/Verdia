import { useState } from 'react';
import {
  WalletCards,
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  Mail,
  ArrowUpRight,
  Check,
  Sparkles,
} from 'lucide-react';
import './FeatureExplorer.css';

const ITEMS = [
  {
    id: 'expenses',
    icon: WalletCards,
    title: 'Control de gastos',
    eyebrow: 'Entiende a dónde va tu dinero',
    description:
      'Visualiza tus movimientos, identifica en qué estás gastando y encuentra patrones sin tener que revisar todo manualmente.',
  },
  {
    id: 'goals',
    icon: CircleDollarSign,
    title: 'Metas de ahorro',
    eyebrow: 'Convierte una intención en un plan',
    description:
      'Define una meta, observa tu progreso y mantén claro cuánto falta para llegar a lo que quieres conseguir.',
  },
  {
    id: 'cards',
    icon: CreditCard,
    title: 'Tarjetas',
    eyebrow: 'Ten tus tarjetas bajo control',
    description:
      'Consulta tus tarjetas y observa su uso de una forma sencilla, sin perder de vista el dinero disponible.',
  },
  {
    id: 'services',
    icon: ReceiptText,
    title: 'Pagos de servicios',
    eyebrow: 'No pierdas de vista tus pagos',
    description:
      'Mantén organizados tus servicios y reconoce rápidamente qué pagos tienes que considerar.',
  },
  {
    id: 'mail',
    icon: Mail,
    title: 'Automatización con tu correo',
    eyebrow: 'Deja que Vera te ayude a revisar',
    description:
      'Verdia puede analizar información que llega a tu correo y ayudarte a identificar movimientos o datos relevantes antes de registrarlos.',
  },
];

export default function FeatureExplorer() {
  const [activeId, setActiveId] = useState(ITEMS[0].id);
  const active = ITEMS.find((item) => item.id === activeId) || ITEMS[0];

  return (
    <section id="funcionalidades-interactivas" className="feature-explorer" aria-labelledby="feature-explorer-title">
      <div className="feature-explorer-inner">
        <div className="feature-explorer-heading">
          <span className="feature-explorer-kicker">CONOCE VERDIA</span>
          <h2 id="feature-explorer-title">
            Todo lo que necesitas para entender mejor tu dinero.
          </h2>
          <p>
            Explora cómo Verdia convierte tus datos financieros en información
            clara para ayudarte a tomar mejores decisiones.
          </p>
        </div>

        <div className="feature-explorer-card">
          <nav className="feature-explorer-tabs" aria-label="Explorar funcionalidades">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`feature-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveId(item.id)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="feature-tab-icon">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>

          <div className={`feature-demo feature-demo-${active.id}`} key={active.id}>
            <div className="feature-demo-copy">
              <span className="feature-demo-eyebrow">{active.eyebrow}</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
            </div>

            <DemoContent type={active.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoContent({ type }) {
  if (type === 'expenses') {
    return (
      <div className="demo-ui expenses-demo" aria-label="Ejemplo de control de gastos">
        <div className="demo-ui-header">
          <div>
            <span>Este mes</span>
            <strong>₡184.500</strong>
          </div>
          <span className="demo-pill">En control</span>
        </div>

        <div className="expense-list">
          <ExpenseRow label="Supermercado" value="₡54.200" width="78%" />
          <ExpenseRow label="Transporte" value="₡31.800" width="48%" />
          <ExpenseRow label="Restaurantes" value="₡24.500" width="38%" />
        </div>

        <div className="demo-insight">
          <Sparkles size={16} />
          <span>Alimentación representa el mayor gasto del mes.</span>
        </div>
      </div>
    );
  }

  if (type === 'goals') {
    return (
      <div className="demo-ui goal-demo" aria-label="Ejemplo de meta de ahorro">
        <div className="goal-card">
          <div className="goal-top">
            <div>
              <span>Meta de ahorro</span>
              <strong>Viaje a Guanacaste</strong>
            </div>
            <span className="goal-percent">70%</span>
          </div>
          <div className="goal-track">
            <span />
          </div>
          <div className="goal-values">
            <span>₡350.000 ahorrados</span>
            <span>₡500.000</span>
          </div>
        </div>
        <div className="goal-note">
          <Check size={16} />
          <span>Vas por buen camino.</span>
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="demo-ui cards-demo" aria-label="Ejemplo de tarjetas">
        <div className="mini-card">
          <div className="mini-card-brand">VERDIA</div>
          <div className="mini-card-number">•••• 4821</div>
          <div className="mini-card-bottom">
            <span>Disponible</span>
            <strong>₡245.000</strong>
          </div>
        </div>
        <div className="card-summary">
          <span>Consumo del mes</span>
          <strong>₡185.400</strong>
          <div className="summary-line"><span /></div>
          <small>72% del límite utilizado</small>
        </div>
      </div>
    );
  }

  if (type === 'services') {
    return (
      <div className="demo-ui services-demo" aria-label="Ejemplo de pagos de servicios">
        <ServiceRow icon="⚡" label="Electricidad" value="₡18.500" />
        <ServiceRow icon="◉" label="Internet" value="₡32.000" />
        <ServiceRow icon="◌" label="Agua" value="₡7.800" />
        <div className="service-status">
          <Check size={15} />
          <span>3 pagos identificados</span>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-ui mail-demo" aria-label="Ejemplo de automatización con correo">
      <div className="mail-message">
        <div className="mail-avatar">BN</div>
        <div className="mail-body">
          <strong>Banco Nacional</strong>
          <span>Estado de cuenta disponible</span>
        </div>
        <Mail size={17} />
      </div>
      <div className="mail-processing">
        <div className="processing-line">
          <span className="processing-dot" />
          Vera analiza la información…
        </div>
        <div className="mail-result">
          <div>
            <span>Movimiento encontrado</span>
            <strong>Supermercado · ₡24.500</strong>
          </div>
          <span className="suggested-tag">Alimentación</span>
        </div>
      </div>
      <div className="vera-rule">
        <Sparkles size={15} />
        <span>Vera propone; tú confirmas.</span>
      </div>
    </div>
  );
}

function ExpenseRow({ label, value, width }) {
  return (
    <div className="expense-row">
      <div className="expense-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="expense-track"><span style={{ width }} /></div>
    </div>
  );
}

function ServiceRow({ icon, label, value }) {
  return (
    <div className="service-row">
      <span className="service-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
      <ArrowUpRight size={15} />
    </div>
  );
}
