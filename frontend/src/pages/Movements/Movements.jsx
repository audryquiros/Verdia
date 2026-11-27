import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, ShoppingBag, ReceiptText, ArrowDownLeft, Car, Pencil, XCircle, Check, ArrowLeftRight, CreditCard } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import DatePicker from '../../components/DatePicker/DatePicker.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Movements.css';
import { getCategoryColor } from '../../utils/categoryColors.js';

const periods = ['Noviembre de 2026','Octubre de 2026','Septiembre de 2026','Agosto de 2026','Julio de 2026','Junio de 2026','Mayo de 2026','Abril de 2026','Marzo de 2026','Febrero de 2026','Enero de 2026'];
const categories = ['Alimentación','Transporte','Servicios','Entretenimiento','Salud','Hogar','Salario','Otros'];
const typeOptions = [
  { value: 'expense', label: 'Gasto' },
  { value: 'income', label: 'Ingreso' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'card_expense', label: 'Gasto con tarjeta' },
  { value: 'debt_received', label: 'Préstamo recibido' },
  { value: 'debt_given', label: 'Préstamo dado' },
  { value: 'debt_collection', label: 'Cobro de deuda' },
  { value: 'debt_payment', label: 'Pago de deuda o tarjeta' },
  { value: 'adjustment', label: 'Ajuste de saldo' },
];
const categoryOptions = categories.map((item) => ({ value: item, label: item }));
const currencyOptions = [{ value: 'CRC', label: 'CRC — Colones' }, { value: 'USD', label: 'USD — Dólares' }];
const statusOptions = [{ value: 'confirmed', label: 'Confirmado · afecta tu balance' }, { value: 'planned', label: 'Planificado · no cambia tu balance' }];
const iconMap = { Alimentación: ShoppingBag, Servicios: ReceiptText, Transporte: Car, Salario: ArrowDownLeft };
const emptyForm = { date: new Date().toISOString().slice(0, 10), name: '', category: 'Alimentación', type: 'expense', amount: '', currency: 'CRC', status: 'confirmed', originAccountId: '', destinationAccountId: '', cardId: '' };

function requiresOrigin(type) { return ['expense','transfer','debt_given','debt_payment','adjustment'].includes(type); }
function requiresDestination(type) { return ['income','transfer','debt_received','debt_collection','adjustment'].includes(type); }
function requiresCard(type) { return type === 'card_expense' || type === 'debt_payment'; }

export default function Movements() {
  const { data, addMovement, updateMovement, confirmMovement, cancelMovement } = useFinanceData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('Noviembre de 2026');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const feedbackTimer = useRef(null);

  const accountOptions = (data.accounts || []).filter((account) => !account.archived).map((account) => ({ value: account.id, label: `${account.name} · ${account.currency}` }));
  const cardOptions = (data.cards || []).map((card) => ({ value: card.id, label: `${card.marca} ·•••• ${card.ultimosCuatro}` }));

  const visible = useMemo(() => data.movements.filter((item) => {
    const matchesType = filter === 'all' || (filter === 'income' ? item.type === 'income' : filter === 'expense' ? ['expense','card_expense'].includes(item.type) : item.type === filter);
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${item.name} ${item.category}`.toLowerCase().includes(q);
    const matchesPeriod = !period || new Date(`${item.date}T12:00:00`).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }).replace(/^./, (c) => c.toUpperCase()) === period;
    return matchesType && matchesSearch && matchesPeriod;
  }), [data.movements, filter, search, period]);

  useEffect(() => () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); }, []);

  const showFeedback = (message, tone = 'success') => {
    setFeedback({ message, tone });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3200);
  };

  const openCreate = () => { setForm({ ...emptyForm }); setModal({ mode: 'create' }); };
  const openEdit = (item) => { setForm({ ...emptyForm, ...item }); setModal({ mode: 'edit', id: item.id }); };
  const handleConfirm = (item) => {
    setPendingAction({ type: 'confirm', item });
  };

  const handleCancel = (item) => {
    setPendingAction({ type: item.status === 'confirmed' ? 'void' : 'cancel', item });
  };

  const executePendingAction = () => {
    if (!pendingAction) return;
    const { type, item } = pendingAction;

    if (type === 'confirm') {
      confirmMovement(item.id);
      showFeedback(`"${item.name}" fue confirmado correctamente.`);
    } else {
      cancelMovement(item.id);
      showFeedback(
        `"${item.name}" fue ${type === 'void' ? 'anulado' : 'cancelado'}.`,
        type === 'void' ? 'warning' : 'success'
      );
    }

    setPendingAction(null);
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (!payload.name.trim() || payload.amount <= 0) return;
    if (payload.type === 'transfer' && (!payload.originAccountId || !payload.destinationAccountId || payload.originAccountId === payload.destinationAccountId)) return;

    const selectedAccountIds = [payload.originAccountId, payload.destinationAccountId].filter(Boolean);
    const openingWarnings = selectedAccountIds
      .map((accountId) => data.accounts.find((account) => account.id === accountId))
      .filter((account) => account?.openingDate && payload.date < account.openingDate);
    if (openingWarnings.length && !window.confirm(`La fecha del movimiento (${payload.date}) es anterior a la fecha de apertura de ${openingWarnings.map((account) => account.name).join(', ')}. Esto puede distorsionar el saldo. ¿Deseas continuar?`)) return;

    if (modal.mode === 'create') {
      addMovement(payload);
      showFeedback(payload.status === 'confirmed' ? `"${payload.name}" fue registrado correctamente.` : `"${payload.name}" fue guardado como planificado.`);
    } else {
      updateMovement(modal.id, payload);
      showFeedback(`"${payload.name}" fue actualizado correctamente.`);
    }
    setModal(null);
  };

  const updateType = (type) => setForm((current) => ({ ...current, type, category: type === 'income' ? 'Salario' : current.category, originAccountId: '', destinationAccountId: '', cardId: '' }));

  return (
    <div className="simple-page movements-page">
      <PageHeader />
      <SectionCard title={null} className="movements-page-card">
        <div className="movements-toolbar">
          <div className="filters">
            {[['all','Todos'],['income','Ingresos'],['expense','Gastos']].map(([value,label]) => <button key={value} className={`filter ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{label}</button>)}
          </div>
          <div className="movements-tools">
            <CustomSelect className="movement-period" ariaLabel="Filtrar movimientos por mes y año" value={period} onChange={setPeriod} options={periods} />
            {searchOpen ? <div className="search-expanded"><Search size={18} aria-hidden="true" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar" aria-label="Buscar movimientos" /></div> : <button type="button" className="search-toggle" aria-label="Buscar movimientos" onClick={() => setSearchOpen(true)}><Search size={20} /></button>}
            <button className="btn btn-primary movements-new-button" onClick={openCreate}><Plus size={20} />Nuevo movimiento</button>
          </div>
        </div>
        <div className="movement-table" role="table" aria-label="Movimientos financieros">
          <div className="table-head" role="row"><span>Fecha</span><span>Descripción</span><span>Categoría</span><span>Estado</span><span className="right">Monto</span><span className="actions-heading">Acciones</span></div>
          <div className="movement-list">
            {visible.map((item) => {
              const Icon = iconMap[item.category] || (item.type === 'transfer' ? ArrowLeftRight : item.type === 'card_expense' ? CreditCard : ReceiptText);
              const statusLabel = item.status === 'planned' ? 'Planificado' : item.status === 'canceled' ? 'Cancelado' : item.status === 'voided' ? 'Anulado' : item.status === 'overdue' ? 'Vencido' : 'Confirmado';
              return <MovementRow
                key={item.id}
                name={item.name}
                category={item.category || 'Sin categoría'}
                date={new Date(`${item.date}T12:00:00`).toLocaleDateString('es-CR',{day:'2-digit',month:'short'}).replace('.','')}
                amount={formatMoney(item.amount,item.currency)}
                type={item.type === 'income' ? 'income' : 'expense'}
                status={item.status}
                icon={Icon}
                categoryVisual={item.type === 'income' ? null : getCategoryColor(item.category)}
                actions={<>
                  {item.status === 'planned' && <button className="movement-action action-hover-button action-confirm" onClick={() => handleConfirm(item)} aria-label={`Confirmar ${item.name}`}><Check size={15} /><span>Confirmar</span></button>}
                  {['confirmed','planned'].includes(item.status) && <button className="movement-action action-hover-button action-edit" onClick={() => openEdit(item)} aria-label={`Editar ${item.name}`}><Pencil size={15} /><span>Editar</span></button>}
                  {['confirmed','planned'].includes(item.status) && <button className="movement-action action-hover-button action-danger" onClick={() => handleCancel(item)} aria-label={`${item.status === 'confirmed' ? 'Anular' : 'Cancelar'} ${item.name}`}><XCircle size={15} /><span>{item.status === 'confirmed' ? 'Anular' : 'Cancelar'}</span></button>}
                  {!['confirmed','planned'].includes(item.status) && <span className="movement-action-status">{statusLabel}</span>}
                </>}
              />;
            })}
            {!visible.length && <div className="empty-state"><strong>No encontramos movimientos</strong><span>Prueba otro filtro o registra un movimiento nuevo.</span></div>}
          </div>
        </div>
      </SectionCard>

      {pendingAction && (
        <Modal
          size="small"
          title={pendingAction.type === 'void' ? 'Anular movimiento' : pendingAction.type === 'cancel' ? 'Cancelar movimiento' : 'Confirmar movimiento'}
          description={
            pendingAction.type === 'void'
              ? 'Esta acción anulará el movimiento y dejará de afectar tu balance. El registro se conservará en tu historial.'
              : pendingAction.type === 'cancel'
                ? 'Esta acción cancelará el movimiento planificado. No afectará tu balance.'
                : 'Esta acción confirmará que el movimiento ocurrió y pasará a afectar tu balance.'
          }
          onClose={() => setPendingAction(null)}
        >
          <div className="movement-confirmation">
            <div className="movement-confirmation-summary">
              <strong>{pendingAction.item.name}</strong>
              <span>{formatMoney(pendingAction.item.amount, pendingAction.item.currency)}</span>
            </div>
            <p>
              {pendingAction.type === 'void'
                ? '¿Deseas continuar con la anulación?'
                : pendingAction.type === 'cancel'
                  ? '¿Deseas continuar con la cancelación?'
                  : '¿Deseas marcarlo como confirmado?'}
            </p>
            <div className="modal-actions movement-confirmation-actions">
              <button type="button" className="btn btn-outline" onClick={() => setPendingAction(null)}>Volver</button>
              <button
                type="button"
                className={`btn ${pendingAction.type === 'void' ? 'btn-danger' : 'btn-primary'}`}
                onClick={executePendingAction}
              >
                {pendingAction.type === 'void' ? 'Anular' : pendingAction.type === 'cancel' ? 'Cancelar movimiento' : 'Confirmar'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {feedback && <div className={`movement-feedback movement-feedback--${feedback.tone}`} role="status" aria-live="polite">
        <span className="movement-feedback-icon">{feedback.tone === 'warning' ? <XCircle size={16} /> : <Check size={16} />}</span>
        <span>{feedback.message}</span>
      </div>}

      {modal && <Modal title={modal.mode === 'create' ? 'Nuevo movimiento' : 'Editar movimiento'} description="Planificado significa esperado; confirmado significa que realmente ocurrió. Los movimientos confirmados no se eliminan: se pueden anular y conservan su historial." onClose={() => setModal(null)}>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="movement-name">Descripción</label><input id="movement-name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} placeholder="Ej. Supermercado" required /></div>
            <div className="form-field"><label htmlFor="movement-amount">Monto</label><input id="movement-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({...form,amount:e.target.value})} placeholder="0" required /></div>
            <div className="form-field"><label>Tipo</label><CustomSelect ariaLabel="Tipo de movimiento" value={form.type} onChange={updateType} options={typeOptions} className="modal-select" /></div>
            <div className="form-field"><label>Categoría</label><CustomSelect ariaLabel="Categoría del movimiento" value={form.category} onChange={(value) => setForm({...form,category:value})} options={categoryOptions} className="modal-select" /></div>
            <div className="form-field"><label>Fecha</label><DatePicker value={form.date} onChange={(value) => setForm({...form,date:value})} /></div>
            <div className="form-field"><label>Moneda</label><CustomSelect ariaLabel="Moneda del movimiento" value={form.currency} onChange={(value) => setForm({...form,currency:value})} options={currencyOptions} className="modal-select" /></div>
            {requiresOrigin(form.type) && <div className="form-field"><label>Cuenta origen</label><CustomSelect ariaLabel="Cuenta origen" value={form.originAccountId} onChange={(value) => setForm({...form,originAccountId:value})} options={accountOptions} className="modal-select" /></div>}
            {requiresDestination(form.type) && <div className="form-field"><label>Cuenta destino</label><CustomSelect ariaLabel="Cuenta destino" value={form.destinationAccountId} onChange={(value) => setForm({...form,destinationAccountId:value})} options={accountOptions} className="modal-select" /></div>}
            {requiresCard(form.type) && <div className="form-field"><label>Tarjeta</label><CustomSelect ariaLabel="Tarjeta relacionada" value={form.cardId} onChange={(value) => setForm({...form,cardId:value})} options={cardOptions} className="modal-select" /></div>}
            <div className="form-field form-field-full"><label>Estado</label>{modal.mode === 'create' ? <CustomSelect ariaLabel="Estado del movimiento" value={form.status} onChange={(value) => setForm({...form,status:value})} options={statusOptions} className="modal-select" /> : <div className="movement-status-readonly">{form.status === 'planned' ? 'Planificado' : form.status === 'confirmed' ? 'Confirmado' : form.status === 'canceled' ? 'Cancelado' : 'Anulado'}</div>}
              <p className="movement-status-help">{form.status === 'confirmed' ? 'Se registra como ocurrido y sí se refleja en tu balance.' : 'Se guarda como esperado y no modifica tu balance hasta que lo confirmes.'}</p>
            </div>
          </div>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="btn btn-primary">{modal.mode === 'create' ? 'Guardar movimiento' : 'Guardar cambios'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
