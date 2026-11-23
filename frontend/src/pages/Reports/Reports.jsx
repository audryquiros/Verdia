import {ArrowUp,ArrowDown,TrendingUp} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import DonutChart from '../../components/DonutChart/DonutChart.jsx';
import MiniChart from '../../components/MiniChart/MiniChart.jsx';
import '../SimplePage.css';
export default function Reports(){return <div className="simple-page"><PageHeader action={<select className="period"><option>Noviembre 2026</option><option>Octubre 2026</option></select>} /><div className="report-stats"><Stat icon={ArrowUp} label="Ingresos" value="₡620.000"/><Stat icon={ArrowDown} label="Gastos" value="₡187.350"/><Stat icon={TrendingUp} label="Ahorro" value="₡172.650"/></div><div className="report-grid"><SectionCard title="Gastos por categoría"><div className="report-donut"><DonutChart segments={['#285E45 0 36%','#A9D29A 36% 54%','#6c8e79 54% 66%','#dbe8d8 66% 100%']}/></div></SectionCard><SectionCard title="Evolución mensual"><MiniChart values={[38,45,52,67,78]}/></SectionCard></div></div>}
function Stat({icon:Icon,label,value}){return <div className="report-stat card"><span><Icon size={16}/></span><div><small>{label}</small><strong>{value}</strong></div></div>}
