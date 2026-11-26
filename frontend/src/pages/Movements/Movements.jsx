import { useMemo, useState } from 'react';
import { Plus, Search, ShoppingBag, ReceiptText, ArrowDownLeft, Car, Pencil, Trash2, Check } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import DatePicker from '../../components/DatePicker/DatePicker.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Movements.css';

const periods = ['Noviembre de 2026','Octubre de 2026','Septiembre de 2026','Agosto de 2026','Julio de 2026','Junio de 2026','Mayo de 2026','Abril de 2026','Marzo de 2026','Febrero de 2026','Enero de 2026'];
const categories = ['Alimentación','Transporte','Servicios','Entretenimiento','Salud','Hogar','Ingreso','Otros'];
const typeOptions = [
  { value: 'expense', label: 'Gasto' },
  { value: 'income', label: 'Ingreso' },
  { value: 'transfer', label: 'Transferencia' },
];
const categoryOptions = categories.map((item) => ({ value: item, label: item }));
const currencyOptions = [
  { value: 'CRC', label: 'CRC — Colones' },
  { value: 'USD', label: 'USD — Dólares' },
];
const statusOptions = [
  { value: 'confirmed', label: 'Confirmado · afecta tu balance' },
  { value: 'planned', label: 'Planificado · no cambia tu balance' },
];
const iconMap = { Alimentación: ShoppingBag, Servicios: ReceiptText, Transporte: Car, Ingreso: ArrowDownLeft };

const emptyForm = { date: '2026-11-26', name: '', category: 'Alimentación', type: 'expense', amount: '', currency: 'CRC', status: 'confirmed' };

export default function Movements() {
  const { data, addMovement, updateMovement, removeMovement } = useFinanceData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('Noviembre de 2026');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const visible = useMemo(() => data.movements.filter((item) => {
    const matchesType = filter === 'all' || (filter === 'income' ? item.type === 'income' : item.type === 'expense');
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${item.name} ${item.category}`.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  }), [data.movements, filter, search]);

  const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); };
  const openEdit = (item) => { setForm(item); setModal({ mode: 'edit', id: item.id }); };
  const confirmMovement = (item) => updateMovement(item.id, { status: 'confirmed' });

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (!payload.name.trim() || payload.amount <= 0) return;
    if (modal.mode === 'create') addMovement({ ...payload, id: `m-${Date.now()}` });
    else updateMovement(modal.id, payload);
    setModal(null);
  };

  return (
    <div className="simple-page movements-page">
      <PageHeader />
      <SectionCard title={null} className="movements-page-card" action={<button className="btn btn-primary movements-new-button" onClick={openCreate}><Plus size={20} />Nuevo movimiento</button>}>
        <div className="movements-toolbar">
          <div className="filters">
            {[[ 'all','Todos' ], ['income','Ingresos'], ['expense','Gastos']].map(([value,label]) => <button key={value} className={`filter ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{label}</button>)}
          </div>
          <div className="movements-tools">
            <CustomSelect className="movement-period" ariaLabel="Filtrar movimientos por mes y año" value={period} onChange={setPeriod} options={periods} />
            {searchOpen ? <div className="search-expanded"><Search size={18} aria-hidden="true" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" aria-label="Buscar movimientos" /></div> : <button type="button" className="search-toggle" aria-label="Buscar movimientos" onClick={() => setSearchOpen(true)}><Search size={20} /></button>}
          </div>
        </div>
        <div className="movement-table" role="table" aria-label="Movimientos financieros">
          <div className="table-head" role="row"><span>Fecha</span><span>Descripción</span><span>Categoría</span><span>Estado</span><span className="right">Monto</span><span aria-label="Acciones" /></div>
          {visible.map((item) => {
            const Icon = iconMap[item.category] || ReceiptText;
            return <div className="movement-row-wrapper" key={item.id}>
              <MovementRow name={item.name} category={item.category} date={new Date(`${item.date}T12:00:00`).toLocaleDateString('es-CR',{day:'2-digit',month:'short'}).replace('.','')} amount={formatMoney(item.amount,item.currency)} type={item.type} status={item.status} icon={Icon} categoryTone={item.type === 'income' ? 'income' : item.category === 'Transporte' ? 'transport' : item.category === 'Servicios' ? 'services' : 'expense'} />
              <div className="movement-actions">
                {item.status === 'planned' && (
                  <button className="movement-action movement-action-confirm" onClick={() => confirmMovement(item)} aria-label={`Confirmar ${item.name}`}>
                    <Check size={15} />
                    <span>Confirmar</span>
                  </button>
                )}
                <button className="movement-action" onClick={() => openEdit(item)} aria-label={`Editar ${item.name}`}>
                  <Pencil size={15} />
                  <span>Editar</span>
                </button>
                <button className="movement-action movement-action-danger" onClick={() => removeMovement(item.id)} aria-label={`Eliminar ${item.name}`}>
                  <Trash2 size={15} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>;
          })}
          {!visible.length && <div className="empty-state"><strong>No encontramos movimientos</strong><span>Prueba otro filtro o registra un movimiento nuevo.</span></div>}
        </div>
      </SectionCard>

      {modal && <Modal title={modal.mode === 'create' ? 'Nuevo movimiento' : 'Editar movimiento'} description="Los datos quedan guardados localmente en este frontend mientras preparamos la API." onClose={() => setModal(null)}>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="movement-name">Descripción</label><input id="movement-name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Ej. Supermercado" required /></div>
            <div className="form-field"><label htmlFor="movement-amount">Monto</label><input id="movement-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({...form,amount:e.target.value})} placeholder="0" required /></div>
            <div className="form-field"><label>Tipo</label><CustomSelect ariaLabel="Tipo de movimiento" value={form.type} onChange={(value) => setForm({...form,type:value})} options={typeOptions} className="modal-select" /></div>
            <div className="form-field"><label>Categoría</label><CustomSelect ariaLabel="Categoría del movimiento" value={form.category} onChange={(value) => setForm({...form,category:value})} options={categoryOptions} className="modal-select" /></div>
            <div className="form-field"><label>Fecha</label><DatePicker value={form.date} onChange={(value) => setForm({...form,date:value})} /></div>
            <div className="form-field"><label>Moneda</label><CustomSelect ariaLabel="Moneda del movimiento" value={form.currency} onChange={(value) => setForm({...form,currency:value})} options={currencyOptions} className="modal-select" /></div>
            <div className="form-field form-field-full"><label>Estado</label><CustomSelect ariaLabel="Estado del movimiento" value={form.status} onChange={(value) => setForm({...form,status:value})} options={statusOptions} className="modal-select" />
              <p className="movement-status-help">{form.status === 'confirmed' ? 'Se registra como ocurrido y sí se refleja en tu balance.' : 'Se guarda como esperado y no modifica tu balance hasta que lo confirmes.'}</p>
            </div>
          </div>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="btn btn-primary">{modal.mode === 'create' ? 'Guardar movimiento' : 'Guardar cambios'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
