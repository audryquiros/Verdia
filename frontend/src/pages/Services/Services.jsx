import {Zap,Droplets,Wifi,Phone,Monitor,MoreHorizontal} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import '../SimplePage.css';
const items=[['Electricidad',Zap],['Agua',Droplets],['Internet',Wifi],['Telefonía',Phone],['Cable / TV',Monitor],['Otros',MoreHorizontal]];
export default function Services(){return <div className="simple-page"><PageHeader /><SectionCard title="Servicios"><div className="service-grid">{items.map(([name,Icon])=><button key={name} className="service-item"><span><Icon size={20}/></span><strong>{name}</strong></button>)}</div></SectionCard></div>}
