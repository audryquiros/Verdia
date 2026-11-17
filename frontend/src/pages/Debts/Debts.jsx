import {Plus,HandCoins} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import '../SimplePage.css';
export default function Debts(){return <div className="simple-page"><div className="page-head"><div><h1>Deudas</h1><p>Administra tus deudas y mantén el control.</p></div><button className="btn btn-primary"><Plus size={16}/> Nueva deuda</button></div><div className="debt-grid"><Debt title="Préstamo personal" amount="₡850.000" detail="Faltan 6 meses" value={42}/><Debt title="Tarjeta de crédito" amount="₡120.000" detail="Pago el 05 dic" value={60}/></div></div>}
function Debt({title,amount,detail,value}){return <SectionCard title={title}><div className="debt-top"><div className="budget-icon"><HandCoins size={16}/></div><strong>{amount}</strong></div><p className="muted small">{detail}</p><ProgressBar value={value}/><div className="debt-foot"><span>{value}%</span><span>progreso</span></div></SectionCard>}
