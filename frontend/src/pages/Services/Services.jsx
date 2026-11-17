import {Zap,Droplets,Wifi,Phone,Monitor,MoreHorizontal} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import '../SimplePage.css';
const items=[['Electricidad',Zap],['Agua',Droplets],['Internet',Wifi],['Telefonía',Phone],['Cable / TV',Monitor],['Otros',MoreHorizontal]];
export default function Services(){return <div className="simple-page"><div className="page-head"><div><h1>Pagos de servicios</h1><p>Gestiona tus servicios desde Verdia.</p></div></div><SectionCard title="Servicios"><div className="service-grid">{items.map(([name,Icon])=><button key={name} className="service-item"><span><Icon size={20}/></span><strong>{name}</strong></button>)}</div></SectionCard></div>}
