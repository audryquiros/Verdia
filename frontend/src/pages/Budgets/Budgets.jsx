import { useState } from 'react';
import { Car, Gamepad2, Plus, Utensils, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Budgets.css';
import { getCategoryColor } from '../../utils/categoryColors.js';

const icons = { Alimentación: Utensils, Transporte: Car, Entretenimiento: Gamepad2 };
const categoryOptions = ['Alimentación','Transporte','Entretenimiento','Salud','Hogar','Otros'].map((value) => ({ value, label: value }));
const emptyForm = { name: 'Alimentación', limit: '' };

function BudgetIcon({ name }) { const Icon = icons[name] || Utensils; const visual = getCategoryColor(name); return <div className="budget-icon" style={{ background: visual.background, color: visual.color }} aria-hidden="true"><Icon size={19} strokeWidth={2}/></div>; }
function toneFor(name){ return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'); }

export default function Budgets(){
  const { data, summary, addBudget, updateBudget, removeBudget } = useFinanceData();
  const [view,setView]=useState('cards'); const [modal,setModal]=useState(null); const [form,setForm]=useState(emptyForm);
  const openCreate=()=>{setForm(emptyForm);setModal({mode:'create'});};
  const openEdit=(item)=>{setForm({name:item.name,limit:item.limit});setModal({mode:'edit',id:item.id});};
  const submit=(e)=>{e.preventDefault(); const payload={...form,limit:Number(form.limit),currency:summary.baseCurrency}; if(!payload.name||payload.limit<=0)return; modal.mode==='create'?addBudget(payload):updateBudget(modal.id,payload);setModal(null);};
  const items=data.budgets.map(item=>{
    const spent=summary.spentByCategory[item.name] || 0;
    const planned=summary.periodPlanned.filter((movement)=>movement.type==='expense'&&movement.category===item.name).reduce((sum,movement)=>sum+Number(movement.amount||0),0);
    return {...item,spent,planned,value:item.limit?Math.min(100,Math.round((spent/item.limit)*100)):0,availableAfterPlanned:item.limit-spent-planned};
  });
  return <div className="simple-page budgets-page"><PageHeader action={<div className="budgets-page-actions"><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Nuevo presupuesto</button><ViewSwitcher value={view} onChange={setView} ariaLabel="Vista de presupuestos" options={[{value:'cards',label:'Cards'},{value:'list',label:'Lista'}]}/></div>}/>
    {view==='list'?<div className="budget-list card">{items.map(item=><article className="budget-list-item" style={{'--category-border': getCategoryColor(item.name).border}} key={item.id}><BudgetIcon name={item.name}/><div className="budget-list-content"><div className="budget-list-title-row"><h2>{item.name}</h2><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(item)} aria-label="Editar presupuesto"><Pencil size={15}/><span>Editar</span></button><button className="icon-btn icon-btn-danger" onClick={()=>removeBudget(item.id)} aria-label="Eliminar presupuesto"><Trash2 size={15}/><span>Eliminar</span></button></div></div><div className="budget-list-values"><span>{formatMoney(item.spent)} de {formatMoney(item.limit)}</span><span>Disponible después de lo planificado: {formatMoney(item.availableAfterPlanned)}</span></div><div className="budget-list-progress"><ProgressBar value={item.value}/><strong>{item.value}%</strong></div></div></article>)}</div>:<div className="budget-grid">{items.map(item=><section className="budget-card card" style={{ '--category-border': getCategoryColor(item.name).border }} key={item.id}><div className="budget-card-top"><BudgetIcon name={item.name}/><div className="budget-card-title"><h2>{item.name}</h2><div className="budget-line"><span>{formatMoney(item.spent)} de {formatMoney(item.limit)}</span><strong>{item.value}%</strong></div></div><div className="inline-actions"><button className="icon-btn" onClick={()=>openEdit(item)} aria-label="Editar presupuesto"><Pencil size={15}/></button><button className="icon-btn icon-btn-danger" onClick={()=>removeBudget(item.id)} aria-label="Eliminar presupuesto"><Trash2 size={15}/></button></div></div><ProgressBar value={item.value}/><div className="budget-derived"><span>Planificado: {formatMoney(item.planned)}</span><strong>Disponible después de lo planificado: {formatMoney(item.availableAfterPlanned)}</strong></div></section>)}</div>}
    {modal&&<Modal title={modal.mode==='create'?'Nuevo presupuesto':'Editar presupuesto'} description="Gastado se calcula únicamente con movimientos confirmados. Lo planificado se muestra aparte y no cambia tu balance." onClose={()=>setModal(null)}><form onSubmit={submit}><div className="form-grid"><div className="form-field"><label>Categoría</label><CustomSelect ariaLabel="Categoría del presupuesto" value={form.name} onChange={(value)=>setForm({...form,name:value})} options={categoryOptions} className="modal-select"/></div><div className="form-field"><label htmlFor="budget-limit">Límite</label><input id="budget-limit" type="number" min="0" value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})} required/></div></div><div className="modal-actions"><button type="button" className="btn btn-outline" onClick={()=>setModal(null)}>Cancelar</button><button className="btn btn-primary">Guardar presupuesto</button></div></form></Modal>}
  </div>;
}
