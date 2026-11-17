import {Home,ArrowLeftRight,Plus,Bot,UserRound} from 'lucide-react';
import {Link} from 'react-router-dom';
import './MobileBottomNav.css';
export default function MobileBottomNav(){return <nav className="mobile-nav"><Link to="/inicio"><Home size={18}/><span>Inicio</span></Link><Link to="/movimientos"><ArrowLeftRight size={18}/><span>Mov.</span></Link><Link to="/movimientos" className="add"><Plus size={22}/></Link><Link to="/vera"><Bot size={18}/><span>Vera</span></Link><Link to="/ajustes"><UserRound size={18}/><span>Perfil</span></Link></nav>}
