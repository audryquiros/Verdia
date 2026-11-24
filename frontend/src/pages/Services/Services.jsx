import { Zap, Droplets, Wifi, Phone, Monitor, MoreHorizontal, CalendarDays, CircleCheck, ShieldCheck, Plus, ReceiptText, ArrowRight, Clock3 } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import '../SimplePage.css';
import './Services.css';

const items = [
  ['Electricidad', Zap, 'electricity'],
  ['Agua', Droplets, 'water'],
  ['Internet', Wifi, 'internet'],
  ['Telefonía', Phone, 'phone'],
  ['Cable / TV', Monitor, 'tv'],
  ['Otros', MoreHorizontal, 'other'],
];

// Datos de ejemplo únicamente para la composición visual del frontend.
// No representan información real del usuario ni están conectados al backend.
const upcomingPayments = [
  { name: 'Electricidad', amount: '₡18.500', due: 'Vence en 5 días', tone: 'electricity', Icon: Zap },
  { name: 'Internet', amount: '₡22.000', due: 'Vence en 9 días', tone: 'internet', Icon: Wifi },
  { name: 'Agua', amount: '₡12.300', due: 'Vence en 12 días', tone: 'water', Icon: Droplets },
];

const quickActions = [
  { icon: Plus, title: 'Agregar servicio', text: 'Guarda un nuevo servicio para tenerlo organizado.' },
  { icon: ReceiptText, title: 'Registrar pago', text: 'Registra un pago cuando realmente haya ocurrido.' },
  { icon: ArrowRight, title: 'Ver movimientos', text: 'Consulta los movimientos relacionados con tus pagos.' },
];

export default function Services() {
  return (
    <div className="simple-page services-page">
      <PageHeader />

      <SectionCard title="Servicios">
        <div className="service-grid">
          {items.map(([name, Icon, tone]) => (
            <button key={name} className={`service-item service-item-${tone}`}>
              <span className="service-item-icon">
                <Icon size={23} strokeWidth={2} />
              </span>
              <strong>{name}</strong>
            </button>
          ))}
        </div>
      </SectionCard>

      <section className="services-lower-grid" aria-label="Próximos pagos y acciones rápidas">
        <div className="services-panel services-upcoming">
          <div className="services-panel-header">
            <div>
              <span className="services-panel-kicker">Organización</span>
              <h2>Próximos pagos</h2>
            </div>
            <span className="services-example-badge">Vista de ejemplo</span>
          </div>

          <div className="services-payment-list">
            {upcomingPayments.map(({ name, amount, due, tone, Icon }) => (
              <article key={name} className="services-payment-item">
                <span className={`services-payment-icon services-payment-icon-${tone}`}>
                  <Icon size={19} strokeWidth={2} />
                </span>
                <div className="services-payment-main">
                  <h3>{name}</h3>
                  <span>{due}</span>
                </div>
                <strong>{amount}</strong>
              </article>
            ))}
          </div>

          <button type="button" className="services-panel-link">
            Ver todos los pagos <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="services-panel services-actions">
          <div className="services-panel-header">
            <div>
              <span className="services-panel-kicker">Accesos rápidos</span>
              <h2>¿Qué quieres hacer?</h2>
            </div>
            <Clock3 size={20} strokeWidth={2} className="services-panel-header-icon" />
          </div>

          <div className="services-action-list">
            {quickActions.map(({ icon: Icon, title, text }) => (
              <button type="button" key={title} className="services-action-item">
                <span className="services-action-icon">
                  <Icon size={19} strokeWidth={2} />
                </span>
                <span className="services-action-copy">
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
                <ArrowRight size={16} strokeWidth={2} className="services-action-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
