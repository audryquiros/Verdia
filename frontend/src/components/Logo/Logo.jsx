import { Leaf } from 'lucide-react';
import './Logo.css';
export default function Logo({light=false}){return <div className={`brand ${light?'brand-light':''}`}><span className="brand-mark"><Leaf size={19}/></span><span>Verdia</span></div>}
