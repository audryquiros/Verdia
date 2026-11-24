import { useMemo, useState } from 'react';
import { Wallet, ArrowDown, ArrowUp, Target, Plus, Mail, ReceiptText, HandCoins, BarChart3, Eye, EyeOff, ArrowLeftRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../../services/auth.js';
import StatCard from '../../components/StatCard/StatCard.jsx';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import DonutChart from '../../components/DonutChart/DonutChart.jsx';
import VeraCard from '../../components/VeraCard/VeraCard.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import MobileBottomNav from '../../components/MobileBottomNav/MobileBottomNav.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const user = getSession()?.user;
  const displayName = user?.nombre || 'Usuario';
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const monthLabel = useMemo(() => new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' }).format(new Date()), []);
  const formattedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const [selectedPeriod, setSelectedPeriod] = useState(formattedMonth);

  return (
    <div className="dashboard">
      <div className="welcome">
        <div>
          <h1>¡Hola, {displayName}! 👋</h1>
          <p>Aquí está el resumen de tus finanzas.</p>
        </div>
        <button className="month" type="button" aria-label={`Periodo ${formattedMonth}`}>
          {formattedMonth}<span>⌄</span>
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Disponible"
          value={balanceVisible ? '₡425.000' : '••••••'}
          icon={Wallet}
          tone="mint"
          action={<button className="stat-eye" type="button" onClick={() => setBalanceVisible((value) => !value)} aria-label={balanceVisible ? 'Ocultar balance' : 'Mostrar balance'}>{balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}</button>}
        />
        <StatCard label="Gastos del mes" value="₡187.350" change="12%" changeBubble positive={false} changeIcon={ArrowDown} icon={ArrowDown} tone="green" />
        <StatCard label="Ingresos del mes" value="₡620.000" change="3%" changeBubble changeIcon={ArrowUp} icon={ArrowUp} tone="lilac" />
        <StatCard label="Meta en curso" value="Viaje a la playa" icon={Target} tone="cream" progress={60} />
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="top-panels">
            <SectionCard title={<><BarChart3 className="summary-title-icon" size={16} strokeWidth={2.4} />Resumen del mes</>} action={<CustomSelect className="month-filter-wrap" ariaLabel="Filtrar por mes y año" value={selectedPeriod} onChange={setSelectedPeriod} options={["Noviembre de 2026","Octubre de 2026","Septiembre de 2026","Agosto de 2026","Julio de 2026","Junio de 2026","Mayo de 2026","Abril de 2026","Marzo de 2026","Febrero de 2026","Enero de 2026"]} />} className="summary-card">
              <div className="summary">
                <DonutChart segments={['#285E45 0 35.64%', '#7B61C9 35.64% 53.46%', '#F4B183 53.46% 71.28%', '#58C7D9 71.28% 83.17%', '#A9D29A 83.17% 100%']} />
                <div className="legend">
                  <Legend color="#285E45" name="Alimentación" value="₡67.500" percent="36%" />
                  <Legend color="#7B61C9" name="Transporte" value="₡33.000" percent="18%" />
                  <Legend color="#F4B183" name="Servicios" value="₡33.000" percent="18%" />
                  <Legend color="#58C7D9" name="Entretenimiento" value="₡22.500" percent="12%" />
                  <Legend color="#A9D29A" name="Otros" value="₡31.350" percent="17%" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title={<><Target className="budget-title-icon" size={18} strokeWidth={2.2} />Presupuesto mensual</>} className="budget-card">
              <div className="budget-total"><strong>₡300.000</strong><span>Presupuesto total</span></div>
              <ProgressBar value={62} />
              <div className="budget-note"><span>₡187.350 gastado</span><span>₡112.650 disponible</span></div>
              <Link className="budget-detail-btn" to="/presupuestos">Ver detalle <span>→</span></Link>
            </SectionCard>
          </div>

          <div className="bottom-panels">
            <SectionCard title={<><ArrowLeftRight className="movements-title-icon" size={20} strokeWidth={2.4} />Últimos movimientos</>} action={<Link className="small-link" to="/movimientos">Ver todos →</Link>} className="movements-card">
              <MovementRow compact name="Walmart" category="Alimentación · Tarjeta" date="Hoy" amount="₡15.500" />
              <MovementRow compact name="ICE" category="Servicios" date="Ayer" amount="₡28.350" />
              <MovementRow compact name="Salario" category="Ingreso" date="3 nov" amount="₡620.000" type="income" />
              <MovementRow compact name="Uber" category="Transporte" date="2 nov" amount="₡6.200" />
            </SectionCard>

            <SectionCard title="Accesos rápidos" className="quick-card">
              <div className="quick-grid">
                <Quick icon={Plus} label="Agregar movimiento" to="/movimientos" />
                <Quick icon={Mail} label="Enviar correo" to="/correo" />
                <Quick icon={ReceiptText} label="Pagar servicio" to="/servicios" />
                <Quick icon={HandCoins} label="Registrar deuda" to="/deudas" />
                <Quick icon={Target} label="Nueva meta" to="/metas" />
                <Quick icon={BarChart3} label="Ver reportes" to="/reportes" />
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="side-col">
          <VeraCard />
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

function Legend({ color, name, value, percent }) {
  return <div className="legend-row"><i style={{ background: color }} /><span>{name}</span><b>{percent}</b><strong>{value}</strong></div>;
}

function Quick({ icon: Icon, label, to }) {
  return <Link className="quick" to={to}><span><Icon size={16} /></span><small>{label}</small></Link>;
}
