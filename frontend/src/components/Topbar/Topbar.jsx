import {Menu,Bell,ChevronDown} from 'lucide-react';
import './Topbar.css';
export default function Topbar({onMenu}){return <header className="topbar"><button className="menu-btn" onClick={onMenu}><Menu size={20}/></button><div className="topbar-spacer"/><button className="icon-btn"><Bell size={17}/></button><div className="avatar">AQ</div><div className="top-user"><strong>Audry Quiros</strong><span>audry@correo.com</span></div><ChevronDown size={15}/></header>}
