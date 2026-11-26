import { useState } from 'react';
import { Car, Gamepad2, Plus, Utensils, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Budgets.css';

const icons = { Alimentación: Utensils, Transporte: Car, Entretenimiento: Gamepad2 };
const emptyForm = { name: 'Alimentación', spent: 0, limit: '' };

function BudgetIcon({ name, tone }) { const Icon = icons[name] || Utensils; return <div className={`budget-icon budget-icon-${tone}`} aria-hidden="true"><Icon size={19} strokeWidth={2}/></div>; }
function toneFor(name){ return name === 'Transporte' ? 'purple' : name === 'Entretenimiento' ? 'coral' : 'green'; }

export default function Budgets(){
  const { data, addBudget, updateBudget, removeBudget } = useFinanceData();
  const [view,setView]=useState('cards'); const [modal,setModal]=useState(null); const [form,setForm]=useState(emptyForm);
  const openCreate=()=>{setForm(emptyForm);setModal({mode:'create'});};
  const openEdit=(item)=>{setForm(item);setModal({mode:'edit',id:item.id});};
  const submit=(e)=>{e.preventDefault(); const payload={...form,spent:Number(form.spent)||0,limit:Number(form.limit)}; if(!payload.name||payload.limit<=0)return; modal.mode==='create'?addBudget(payload):updateBudget(modal.id,payload);setModal(null);};
  const items=data.budgets.map(item=>({...item,value:item.limit?Math.min(100,Math.round((item.spent/item.limit)*100)):0}));
  return <div className="simple-page budgets-page"><PageHeader action={<div className="budgets-page-actions"><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Nuevo presupuesto</button><ViewSwitcher value={view} onChange={setView} ariaLabel="Vista de presupuestos" options={[{value:'cards',label:'Cards'},{value:'list',label:'Lista'}]}/></div>}/>
    {view==='list'?<div className="budget-list card">{items.map(item=><article className="budget-list-item" key={item.id}><BudgetIcon name={item.name} tone={toneFor(item.name)}/><div className="budget-list-content"><div className="budget-list-title-row"><h2>{item.name}</h2><strong>{item.value}%</strong></div><div className="budget-list-values"><span>{formatMoney(item.spent)} de {formatMoney(item.limit)}</span></div><ProgressBar value={item.value}/></div><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(item)} aria-label="Editar presupuesto"><Pencil size={15}/></button><button className="icon-btn icon-btn-danger" onClick={()=>removeBudget(item.id)} aria-label="Eliminar presupuesto"><Trash2 size={15}/></button></div></article>)}</div>:<div className="budget-grid">{items.map(item=><section className={`budget-card card budget-card-${toneFor(item.name)}`} key={item.id}><div className="budget-card-top"><BudgetIcon name={item.name} tone={toneFor(item.name)}/><div className="budget-card-title"><h2>{item.name}</h2><div className="budget-line"><span>{formatMoney(item.spent)} de {formatMoney(item.limit)}</span><strong>{item.value}%</strong></div></div><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(item)} aria-label="Editar presupuesto"><Pencil size={15}/></button><button className="icon-btn icon-btn-danger" onClick={()=>removeBudget(item.id)} aria-label="Eliminar presupuesto"><Trash2 size={15}/></button></div></div><ProgressBar value={item.value}/></section>)}</div>}
    {modal&&<Modal title={modal.mode==='create'?'Nuevo presupuesto':'Editar presupuesto'} description="Define un límite para comparar lo planificado con tus gastos confirmados." onClose={()=>setModal(null)}><form onSubmit={submit}><div className="form-grid"><div className="form-field"><label htmlFor="budget-name">Categoría</label><select id="budget-name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}>{['Alimentación','Transporte','Entretenimiento','Salud','Hogar','Otros'].map(x=><option key={x}>{x}</option>)}</select></div><div className="form-field"><label htmlFor="budget-limit">Límite</label><input id="budget-limit" type="number" min="0" value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})} required/></div><div className="form-field form-field-full"><label htmlFor="budget-spent">Gasto confirmado actual</label><input id="budget-spent" type="number" min="0" value={form.spent} onChange={e=>setForm({...form,spent:e.target.value})}/></div></div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary">Guardar presupuesto</button></div></form></Modal>}
  </div>;
}
