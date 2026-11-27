import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Landmark, Wallet, PiggyBank, Plus, Archive, DollarSign, RotateCcw, Trash2, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
import DatePicker from '../../components/DatePicker/DatePicker.jsx';
import { formatMoney, useFinanceData } from '../../context/FinanceDataContext.jsx';
import '../SimplePage.css';
import './Accounts.css';

const typeOptions = [
  { value: 'bank', label: 'Cuenta bancaria' },
  { value: 'savings', label: 'Ahorros' },
  { value: 'cash', label: 'Efectivo' },
];
const currencyOptions = [
  { value: 'CRC', label: 'CRC — Colones' },
  { value: 'USD', label: 'USD — Dólares' },
];
const adjustmentReasons = [
  { value: 'missing', label: 'Falta un movimiento' },
  { value: 'fee', label: 'Comisión o interés bancario' },
  { value: 'opening', label: 'Corrección del saldo inicial' },
  { value: 'unknown', label: 'Diferencia que no logro identificar' },
  { value: 'other', label: 'Otro' },
];
function getLocalDateISO() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const emptyForm = { name: '', type: 'bank', currency: 'CRC', initialBalance: '', openingDate: getLocalDateISO() };
const emptyAdjustment = { observedDate: getLocalDateISO(), observedBalance: '', reason: 'unknown', note: '', feeMode: 'adjustment' };
const iconMap = { bank: Landmark, savings: PiggyBank, cash: Wallet };

const hasAnyMovement = (accountId, movements) => movements.some((movement) => movement.originAccountId === accountId || movement.destinationAccountId === accountId);

export default function Accounts() {
  const navigate = useNavigate();
  const { data, summary, addAccount, updateAccount, archiveAccount, reactivateAccount, deleteAccount, getAccountBalance, addMovement } = useFinanceData();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [adjustment, setAdjustment] = useState(emptyAdjustment);
  const [view, setView] = useState('cards');
  const [feedback, setFeedback] = useState(null);
  const [pendingAdjustment, setPendingAdjustment] = useState(null);

  const activeAccounts = (data.accounts || []).filter((account) => !account.archived);
  const archivedAccounts = (data.accounts || []).filter((account) => account.archived);
  const usdBalance = summary.balancesByCurrency?.USD || 0;

  const openCreate = () => { setForm({ ...emptyForm }); setModal({ mode: 'create' }); };
  const openEdit = (account) => {
    const movements = data.movements || [];
    const hasMovements = hasAnyMovement(account.id, movements);
    setForm({ name: account.name, type: account.type, currency: account.currency, initialBalance: account.initialBalance, openingDate: account.openingDate || '' });
    setModal({ mode: 'edit', id: account.id, hasMovements });
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, initialBalance: Number(form.initialBalance || 0) };
    if (!payload.name.trim() || !payload.openingDate) return;
    if (modal.mode === 'create') addAccount(payload);
    else updateAccount(modal.id, payload);
    setModal(null);
  };

  const openAdjustment = (account) => {
    const today = getLocalDateISO();
    setAdjustment({ ...emptyAdjustment, observedDate: today });
    setModal({ mode: 'adjustment', accountId: account.id, account });
  };

  const observedBalance = Number(adjustment.observedBalance || 0);
  const calculatedBalance = modal?.mode === 'adjustment' ? getAccountBalance(modal.accountId, adjustment.observedDate) : 0;
  const difference = observedBalance - calculatedBalance;
  const adjustmentMagnitude = Math.abs(difference);
  const adjustmentIsZero = adjustmentMagnitude < 0.000001;
  const largeDifferenceThreshold = Math.min(Math.abs(calculatedBalance) * 0.05, 20000);
  const largeDifference = adjustmentMagnitude > 0 && adjustmentMagnitude > largeDifferenceThreshold;

  const submitAdjustment = (event) => {
    event.preventDefault();
    if (!modal?.account || !adjustment.observedDate || adjustment.observedDate > getLocalDateISO()) return;
    if (adjustment.reason === 'missing') {
      setModal(null);
      navigate('/movimientos');
      return;
    }
    if (adjustmentIsZero) return;
    setPendingAdjustment({ account: modal.account, accountId: modal.accountId, adjustment: { ...adjustment }, difference, amount: adjustmentMagnitude });
  };

  const executeAdjustment = () => {
    if (!pendingAdjustment) return;
    const { account, accountId, adjustment: draft, difference: draftDifference, amount } = pendingAdjustment;
    if (draft.reason === 'fee' && draft.feeMode === 'expense') {
      addMovement({
        date: draft.observedDate,
        name: draft.note.trim() || 'Comisión o interés bancario',
        category: 'Intereses y comisiones',
        type: 'expense',
        amount,
        currency: account.currency,
        status: 'confirmed',
        originAccountId: accountId,
      });
    } else {
      const movement = draftDifference > 0 ? { destinationAccountId: accountId } : { originAccountId: accountId };
      addMovement({
        date: draft.observedDate,
        name: 'Ajuste de saldo',
        category: 'Ajustes de saldo',
        type: 'adjustment',
        amount,
        currency: account.currency,
        status: 'confirmed',
        reason: draft.reason,
        note: draft.note.trim(),
        ...movement,
      });
    }
    setFeedback({ message: draft.reason === 'fee' && draft.feeMode === 'expense' ? 'La comisión o interés se registró como gasto.' : `El saldo de ${account.name} se ajustó ${draftDifference > 0 ? 'al alza' : 'a la baja'} en ${formatMoney(amount, account.currency)}.` });
    setPendingAdjustment(null);
    setModal(null);
  };

  const deleteSelectedAccount = (account) => {
    if (hasAnyMovement(account.id, data.movements || [])) return;
    deleteAccount(account.id);
    setFeedback({ message: `La cuenta "${account.name}" fue eliminada.` });
  };

  const formatOpeningDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') : 'Sin fecha';

  return (
    <div className="simple-page accounts-page">
      <PageHeader />

      <div className="account-summary">
        <div className="account-stat account-stat--green">
          <span className="account-stat-icon"><Wallet size={19} /></span>
          <div className="account-stat-copy"><span>Tengo</span><strong>{formatMoney(summary.tengo, summary.baseCurrency)}</strong><small>Saldo real en {summary.baseCurrency}</small></div>
        </div>
        <div className="account-stat account-stat--yellow">
          <span className="account-stat-icon"><DollarSign size={19} /></span>
          <div className="account-stat-copy"><span>Saldo en dólares</span><strong>{formatMoney(usdBalance, 'USD')}</strong><small>Solo cuentas denominadas en USD</small></div>
        </div>
        <div className="account-stat account-stat--neutral">
          <span className="account-stat-icon"><Landmark size={19} /></span>
          <div className="account-stat-copy"><span>Cuentas activas</span><strong>{activeAccounts.length}</strong><small>Los saldos se calculan, no se editan.</small></div>
        </div>
      </div>

      <SectionCard title="Mis cuentas" subtitle="Cada cuenta mantiene su propia moneda, saldo inicial e historial." action={<div className="accounts-section-actions"><button className="btn btn-primary accounts-new-button" onClick={openCreate}><Plus size={17} />Nueva cuenta</button><ViewSwitcher value={view} onChange={setView} options={[{ value: 'cards', label: 'Tarjetas' }, { value: 'list', label: 'Lista' }]} ariaLabel="Formato de cuentas" /></div>}>
        <div className={`account-grid ${view === 'list' ? 'list-view' : ''}`}>
          {activeAccounts.map((account) => {
            const Icon = iconMap[account.type] || Wallet;
            const balance = getAccountBalance(account.id);
            const hasMovements = hasAnyMovement(account.id, data.movements || []);
            const canArchive = Math.abs(balance) < 0.000001;
            return (
              <article className={`account-card account-card--${account.type} ${account.currency === 'USD' ? 'account-card--usd' : ''}`} key={account.id}>
                <div className="account-card-top"><span className="account-icon"><Icon size={19} /></span><span className="account-currency">{account.currency}</span></div>
                <strong>{account.name}</strong>
                <span className="account-type">{typeOptions.find((item) => item.value === account.type)?.label || account.type}</span>
                <div className="account-opening-meta"><span>Saldo inicial: {formatMoney(account.initialBalance, account.currency)}</span><span>Apertura: {formatOpeningDate(account.openingDate)}</span></div>
                <div className="account-financial-row">
                  <div className="account-balance">{formatMoney(balance, account.currency)}</div>
                  <div className="account-actions">
                    <button className="btn btn-outline" onClick={() => openEdit(account)}>Editar</button>
                    <button className="icon-button icon-button-with-label" onClick={() => openAdjustment(account)} aria-label={`Ajustar saldo de ${account.name}`}><SlidersHorizontal size={16} /><span>Ajustar saldo</span></button>
                    <button className="icon-button icon-button-with-label" title={canArchive ? undefined : 'Solo puedes archivar una cuenta con saldo cero'} disabled={!canArchive} onClick={() => archiveAccount(account.id)} aria-label={`Archivar ${account.name}`}><Archive size={16} /><span>Archivar</span></button>
                    {!hasMovements && <button className="icon-button icon-button-with-label icon-button-danger" onClick={() => deleteSelectedAccount(account)} aria-label={`Eliminar ${account.name}`}><Trash2 size={16} /><span>Eliminar</span></button>}
                  </div>
                </div>
              </article>
            );
          })}
          {!activeAccounts.length && <div className="empty-state"><strong>No tienes cuentas activas</strong><span>Agrega la primera cuenta para empezar a calcular tu balance real.</span></div>}
        </div>
      </SectionCard>

      {archivedAccounts.length > 0 && (
        <SectionCard title="Archivadas" subtitle="Se conservan para mantener el historial. Puedes reactivarlas cuando lo necesites.">
          <div className="archived-list">
            {archivedAccounts.map((account) => <div key={account.id}>
              <div><strong>{account.name}</strong><span>Saldo actual: {formatMoney(getAccountBalance(account.id), account.currency)} · {account.currency}</span></div>
              <button className="icon-button icon-button-with-label" onClick={() => reactivateAccount(account.id)} aria-label={`Reactivar ${account.name}`}><RotateCcw size={16} /><span>Reactivar</span></button>
            </div>)}
          </div>
        </SectionCard>
      )}

      {feedback && <div className="account-feedback" role="status" aria-live="polite"><CheckIcon />{feedback.message}</div>}

      {modal?.mode === 'create' || modal?.mode === 'edit' ? createPortal(
        <Modal title={modal.mode === 'create' ? 'Nueva cuenta' : 'Editar cuenta'} description="El saldo real se calcula con el saldo inicial y los movimientos confirmados." onClose={() => setModal(null)}>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="form-field"><label htmlFor="account-name">Nombre</label><input id="account-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. BAC Principal" required /></div>
              <div className="form-field"><label>Tipo</label><CustomSelect ariaLabel="Tipo de cuenta" value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={typeOptions} className="modal-select" /></div>
              <div className="form-field"><label>Moneda</label>{modal.mode === 'edit' && modal.hasMovements ? <div className="movement-status-readonly">{form.currency === 'CRC' ? 'CRC — Colones' : 'USD — Dólares'}</div> : <CustomSelect ariaLabel="Moneda de la cuenta" value={form.currency} onChange={(value) => setForm({ ...form, currency: value })} options={currencyOptions} className="modal-select" />} {modal.mode === 'edit' && modal.hasMovements && <p className="account-form-help">La moneda está bloqueada porque esta cuenta ya tiene movimientos. Si fue creada con la moneda incorrecta, crea una cuenta nueva y archiva esta.</p>}</div>
              <div className="form-field"><label htmlFor="account-balance">Saldo inicial</label><input id="account-balance" type="number" min="0" step="0.01" value={form.initialBalance} disabled={modal.mode === 'edit' && modal.hasMovements} onChange={(e) => setForm({ ...form, initialBalance: e.target.value })} placeholder="0" required />{modal.mode === 'edit' && modal.hasMovements && <p className="account-form-help">El saldo inicial queda bloqueado. Si necesitas corregirlo, usa Ajustar saldo con el motivo «Corrección del saldo inicial».</p>}</div>
              <div className="form-field"><label>Fecha de apertura</label><DatePicker value={form.openingDate} onChange={(value) => setForm({ ...form, openingDate: value })} ariaLabel="Fecha de apertura de la cuenta" /><p className="account-form-help">Los movimientos anteriores a esta fecha mostrarán una advertencia porque pueden distorsionar el saldo.</p></div>
            </div>
            <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="btn btn-primary">{modal.mode === 'create' ? 'Crear cuenta' : 'Guardar cambios'}</button></div>
          </form>
        </Modal>, document.body) : null}

      {pendingAdjustment && createPortal(
        <Modal size="small" title="Confirmar ajuste" description="El ajuste se registrará como un movimiento confirmado y quedará visible en el historial." onClose={() => setPendingAdjustment(null)}>
          <div className="movement-confirmation">
            <div className="movement-confirmation-summary"><strong>{pendingAdjustment.account.name}</strong><span>{formatMoney(pendingAdjustment.amount, pendingAdjustment.account.currency)}</span></div>
            <p>{pendingAdjustment.adjustment.reason === 'fee' && pendingAdjustment.adjustment.feeMode === 'expense' ? 'Se registrará como gasto en «Intereses y comisiones».' : `El saldo ${pendingAdjustment.difference > 0 ? 'aumentará' : 'disminuirá'} en ${formatMoney(pendingAdjustment.amount, pendingAdjustment.account.currency)}.`}</p>
            <div className="modal-actions movement-confirmation-actions"><button type="button" className="btn btn-outline" onClick={() => setPendingAdjustment(null)}>Volver</button><button type="button" className="btn btn-primary" onClick={executeAdjustment}>Confirmar ajuste</button></div>
          </div>
        </Modal>, document.body)}

      {modal?.mode === 'adjustment' && createPortal(
        <Modal size="adjustment" title={`Ajustar saldo · ${modal.account.name}`} description="Compara el saldo real que ves con el saldo que Verdia calcula usando solo movimientos confirmados hasta la fecha indicada." onClose={() => setModal(null)}>
          <form onSubmit={submitAdjustment}>
            <div className="adjustment-grid">
              <div className="adjustment-card"><div className="adjustment-card-label"><span>Saldo calculado</span><span className="adjustment-label-badge adjustment-label-badge--calculated">VERDIA</span></div><strong>{formatMoney(calculatedBalance, modal.account.currency)}</strong><small>Movimientos confirmados hasta {formatOpeningDate(adjustment.observedDate)}</small></div>
              <div className="adjustment-card adjustment-card--observed"><div className="adjustment-card-label"><span>Saldo observado</span><span className="adjustment-label-badge adjustment-label-badge--real">SALDO REAL</span></div><input type="number" min="0" step="0.01" value={adjustment.observedBalance} onChange={(e) => setAdjustment({ ...adjustment, observedBalance: e.target.value })} placeholder="0" required /><small>Escribe aquí el saldo que realmente ves en tu cuenta.</small></div>
              <div className={`adjustment-card ${adjustmentIsZero ? '' : difference > 0 ? 'is-positive' : 'is-negative'}`}><div className="adjustment-card-label"><span>Diferencia</span><span className="adjustment-label-badge adjustment-label-badge--difference">RESULTADO</span></div><strong>{formatMoney(difference, modal.account.currency)}</strong><small>{adjustmentIsZero ? 'No hay diferencia que ajustar.' : difference > 0 ? 'El ajuste aumentará el saldo de la cuenta.' : 'El ajuste reducirá el saldo de la cuenta.'}</small></div>
            </div>

            {largeDifference && !adjustmentIsZero && <div className="adjustment-warning"><AlertTriangle size={20} /><div><strong>La diferencia es considerable.</strong><span>Se activa cuando supera el 5% del saldo calculado o el umbral fijo de {formatMoney(20000, modal.account.currency)}, tomando el menor. Antes de crear el ajuste, revisa si falta un movimiento.</span></div></div>}

            <div className="form-grid adjustment-details-grid">
              <div className="form-field"><label>Fecha de comparación</label><div className="adjustment-date-display"><span>Hoy · {formatOpeningDate(adjustment.observedDate)}</span><span className="adjustment-auto-badge">AUTOMÁTICA</span></div></div>
              <div className="form-field"><label>Motivo</label><CustomSelect ariaLabel="Motivo del ajuste" value={adjustment.reason} onChange={(value) => setAdjustment({ ...adjustment, reason: value })} options={adjustmentReasons} className="modal-select" /></div>
              {adjustment.reason === 'fee' && <div className="form-field form-field-full"><label>¿Cómo quieres registrarlo?</label><div className="choice-row"><label className={`choice-card ${adjustment.feeMode === 'expense' ? 'selected' : ''}`}><input type="radio" name="feeMode" checked={adjustment.feeMode === 'expense'} onChange={() => setAdjustment({ ...adjustment, feeMode: 'expense' })} /><span>Como gasto</span><small>Se registra en «Intereses y comisiones».</small></label><label className={`choice-card ${adjustment.feeMode === 'adjustment' ? 'selected' : ''}`}><input type="radio" name="feeMode" checked={adjustment.feeMode === 'adjustment'} onChange={() => setAdjustment({ ...adjustment, feeMode: 'adjustment' })} /><span>Como ajuste</span><small>Corrige el saldo sin afectar ingresos, gastos ni presupuestos.</small></label></div></div>}
              <div className="form-field form-field-full"><label htmlFor="adjustment-note">Nota</label><input id="adjustment-note" value={adjustment.note} onChange={(e) => setAdjustment({ ...adjustment, note: e.target.value })} placeholder="Opcional: qué revisaste o por qué existe la diferencia" /></div>
            </div>

            {adjustment.reason === 'missing' ? <div className="adjustment-redirect"><strong>Falta un movimiento</strong><span>Te llevaremos a Movimientos para registrarlo. No se creará ningún ajuste automáticamente.</span></div> : !adjustmentIsZero && <div className="adjustment-impact"><span className="adjustment-impact-label">Impacto en tu dinero</span><strong>{adjustment.reason === 'fee' && adjustment.feeMode === 'expense' ? `Se registrará un gasto de ${formatMoney(adjustmentMagnitude, modal.account.currency)} y el saldo disminuirá en ese monto.` : `${difference > 0 ? 'Tu saldo aumentará' : 'Tu saldo disminuirá'} ${formatMoney(adjustmentMagnitude, modal.account.currency)}.`}</strong><small>Tu Libre se recalculará automáticamente con este cambio.</small></div>}

            <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="btn btn-primary" disabled={adjustment.reason !== 'missing' && adjustmentIsZero}>{adjustment.reason === 'missing' ? 'Ir a Movimientos' : 'Registrar ajuste'}</button></div>
          </form>
        </Modal>, document.body)}
    </div>
  );
}

function CheckIcon() {
  return <span className="account-feedback-icon">✓</span>;
}
