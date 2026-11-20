import { useMemo, useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Target, Plus, Mail, ReceiptText, HandCoins, BarChart3, Eye, EyeOff, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../../services/auth.js';
import StatCard from '../../components/StatCard/StatCard.jsx';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import DonutChart from '../../components/DonutChart/DonutChart.jsx';
import VeraCard from '../../components/VeraCard/VeraCard.jsx';
import MobileBottomNav from '../../components/MobileBottomNav/MobileBottomNav.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const user = getSession()?.user;
  const displayName = user?.nombre || 'Usuario';
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const monthLabel = useMemo(() => new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' }).format(new Date()), []);
  const formattedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

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
          change="Balance actual"
          icon={Wallet}
          tone="mint"
          action={<button className="stat-eye" type="button" onClick={() => setBalanceVisible((value) => !value)} aria-label={balanceVisible ? 'Ocultar balance' : 'Mostrar balance'}>{balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}</button>}
        />
        <StatCard label="Gastos del mes" value="₡187.350" change="12% vs. mes anterior" icon={ArrowDownLeft} positive={false} tone="green" />
        <StatCard label="Ingresos del mes" value="₡620.000" change="3% vs. mes anterior" icon={ArrowUpRight} tone="lilac" />
        <StatCard label="Meta en curso" value="Viaje a la playa" change="60% completado" icon={Target} tone="cream" />
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="top-panels">
            <SectionCard title="Resumen del mes" subtitle={formattedMonth} className="summary-card">
              <div className="summary">
                <DonutChart segments={['#285E45 0 36%', '#A9D29A 36% 54%', '#6c8e79 54% 66%', '#dbe8d8 66% 100%']} />
                <div className="legend">
                  <Legend color="#285E45" name="Alimentación" value="₡67.500" percent="36%" />
                  <Legend color="#A9D29A" name="Transporte" value="₡33.000" percent="18%" />
                  <Legend color="#6c8e79" name="Servicios" value="₡33.000" percent="18%" />
                  <Legend color="#dbe8d8" name="Entretenimiento" value="₡22.500" percent="12%" />
                  <Legend color="#e8f0e7" name="Otros" value="₡31.350" percent="17%" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Presupuesto mensual" action={<Link className="small-link" to="/presupuestos">Ver detalle →</Link>} className="budget-card">
              <div className="budget-total"><strong>₡300.000</strong><span>Presupuesto total</span></div>
              <ProgressBar value={62} />
              <div className="budget-note"><span>₡187.350 gastado</span><span>₡112.650 disponible</span></div>
            </SectionCard>
          </div>

          <div className="bottom-panels">
            <SectionCard title="Últimos movimientos" action={<Link className="small-link" to="/movimientos">Ver todos →</Link>} className="movements-card">
              <MovementRow name="Walmart" category="Alimentación · Tarjeta" date="Hoy" amount="₡15.500" />
              <MovementRow name="ICE" category="Servicios" date="Ayer" amount="₡28.350" />
              <MovementRow name="Salario" category="Ingreso" date="3 nov" amount="₡620.000" type="income" />
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
