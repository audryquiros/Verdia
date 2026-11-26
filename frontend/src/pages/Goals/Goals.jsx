import { useState } from 'react';
import { Laptop, Plane, Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Goals.css';

const emptyForm={title:'',target:'',saved:0};
const iconFor=(title)=>/laptop/i.test(title)?Laptop:Plane;
const variantFor=(title)=>/laptop/i.test(title)?'purple':'green';
const GoalIcon=({title})=>{const Icon=iconFor(title);return <Icon size={22}/>;};

export default function Goals(){
 const {data,addGoal,updateGoal,removeGoal}=useFinanceData(); const [view,setView]=useState('cards');const [modal,setModal]=useState(null);const [form,setForm]=useState(emptyForm);
 const openCreate=()=>{setForm(emptyForm);setModal({mode:'create'});}; const openEdit=(item)=>{setForm(item);setModal({mode:'edit',id:item.id});};
 const submit=e=>{e.preventDefault();const payload={...form,target:Number(form.target),saved:Number(form.saved)||0};if(!payload.title||payload.target<=0)return;modal.mode==='create'?addGoal(payload):updateGoal(modal.id,payload);setModal(null);};
 const items=data.goals.map(g=>({...g,value:g.target?Math.min(100,Math.round(g.saved/g.target*100)):0}));
 return <div className="simple-page goals-page"><PageHeader action={<div className="goals-page-actions"><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Nueva meta</button><ViewSwitcher value={view} onChange={setView} ariaLabel="Vista de metas" options={[{value:'cards',label:'Cards'},{value:'list',label:'Lista'}]}/></div>}/>
 {view==='list'?<section className="goals-list-card card"><div className="goals-list">{items.map(g=><article className={`goal-item goal-item-${variantFor(g.title)}`} key={g.id}><div className={`goal-item-icon goal-item-icon-${variantFor(g.title)}`}><GoalIcon title={g.title}/></div><div className="goal-item-main"><div className="goal-item-heading"><div><h2>{g.title}</h2><p>{formatMoney(g.saved)} de {formatMoney(g.target)}</p></div><strong>{g.value}%</strong></div><ProgressBar value={g.value}/></div><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(g)} aria-label="Editar meta"><Pencil size={15}/></button><button className="icon-btn icon-btn-danger" onClick={()=>removeGoal(g.id)} aria-label="Eliminar meta"><Trash2 size={15}/></button></div></article>)}</div></section>:<section className="goals-cards-grid">{items.map(g=>{const Icon=iconFor(g.title);return <article className={`goal-card card goal-card-${variantFor(g.title)}`} key={g.id}><div className="goal-card-top"><div className={`goal-item-icon goal-item-icon-${variantFor(g.title)}`}><Icon size={22}/></div><span>{g.value}%</span></div><div className="goal-card-content"><div className="goal-title-actions"><h2>{g.title}</h2><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(g)} aria-label="Editar meta"><Pencil size={15}/></button><button className="icon-btn icon-btn-danger" onClick={()=>removeGoal(g.id)} aria-label="Eliminar meta"><Trash2 size={15}/></button></div></div><div className="goal-card-amount"><strong>{formatMoney(g.saved)}</strong><span>de {formatMoney(g.target)}</span></div><ProgressBar value={g.value}/><div className="goal-card-foot"><span>{g.value}%</span><span>completado</span></div></div></article>})}</section>}
 {modal&&<Modal title={modal.mode==='create'?'Nueva meta':'Editar meta'} description="Define un objetivo y registra cuánto has separado para alcanzarlo." onClose={()=>setModal(null)}><form onSubmit={submit}><div className="form-grid"><div className="form-field form-field-full"><label htmlFor="goal-title">Nombre</label><input id="goal-title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ej. Viaje a la playa" required/></div><div className="form-field"><label htmlFor="goal-target">Monto objetivo</label><input id="goal-target" type="number" min="0" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} required/></div><div className="form-field"><label htmlFor="goal-saved">Monto ahorrado</label><input id="goal-saved" type="number" min="0" value={form.saved} onChange={e=>setForm({...form,saved:e.target.value})}/></div></div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary">Guardar meta</button></div></form></Modal>}
 </div>;
}
