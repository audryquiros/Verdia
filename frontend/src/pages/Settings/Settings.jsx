import {UserRound,ShieldCheck,Mail,SlidersHorizontal,Bell,Palette} from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import '../SimplePage.css';
export default function Settings(){return <div className="simple-page"><PageHeader /><div className="settings-layout"><aside className="settings-nav"><button className="active"><UserRound size={15}/> Cuenta</button><button><ShieldCheck size={15}/> Seguridad</button><button><SlidersHorizontal size={15}/> Preferencias</button><button><Mail size={15}/> Correos conectados</button><button><Bell size={15}/> Notificaciones</button><button><Palette size={15}/> Modo de interfaz</button></aside><SectionCard title="Cuenta"><div className="form-grid"><Field label="Nombre completo" value="Audry Quiros"/><Field label="Correo electrónico" value="audry@correo.com"/><Field label="Idioma" value="Español"/><Field label="Moneda principal" value="Colón costarricense (CRC)"/></div></SectionCard></div></div>}
function Field({label,value}){return <label className="field"><span>{label}</span><input defaultValue={value}/></label>}
