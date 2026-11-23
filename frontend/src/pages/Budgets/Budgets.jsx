import {Plus,Utensils,Car,Gamepad2} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import '../SimplePage.css';
export default function Budgets(){const data=[['Alimentación','₡67.300 de ₡100.000',67,Utensils],['Transporte','₡33.000 de ₡60.000',55,Car],['Entretenimiento','₡22.000 de ₡40.000',55,Gamepad2]];return <div className="simple-page"><PageHeader action={<button className="btn btn-primary"><Plus size={16}/> Nuevo presupuesto</button>} /><div className="budget-grid">{data.map(([name,text,val,Icon])=><SectionCard key={name} title={name}><div className="budget-icon"><Icon size={16}/></div><div className="budget-line"><span>{text}</span><b>{val}%</b></div><ProgressBar value={val}/></SectionCard>)}</div></div>}
