import {Plus,Plane,Laptop} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import '../SimplePage.css';
export default function Goals(){return <div className="simple-page"><PageHeader action={<button className="btn btn-primary"><Plus size={16}/> Nueva meta</button>} /><div className="goal-grid"><Goal title="Viaje a la playa" amount="₡600.000" saved="₡360.000" value={60} icon={Plane}/><Goal title="Laptop" amount="₡600.000" saved="₡250.000" value={42} icon={Laptop}/></div></div>}
function Goal({title,amount,saved,value,icon:Icon}){return <SectionCard title={title}><div className="goal-visual"><div className="goal-icon"><Icon size={23}/></div><div><strong>{saved}</strong><span>de {amount}</span></div></div><ProgressBar value={value}/><div className="debt-foot"><span>{value}%</span><span>completado</span></div></SectionCard>}
