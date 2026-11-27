import { useState } from 'react';
import { Landmark, Wallet, PiggyBank, Plus, Archive, DollarSign } from 'lucide-react';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher.jsx';
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
const emptyForm = { name: '', type: 'bank', currency: 'CRC', initialBalance: '' };
const iconMap = { bank: Landmark, savings: PiggyBank, cash: Wallet };

export default function Accounts() {
  const { data, summary, addAccount, updateAccount, archiveAccount, getAccountBalance } = useFinanceData();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState('cards');

  const activeAccounts = (data.accounts || []).filter((account) => !account.archived);
  const archivedAccounts = (data.accounts || []).filter((account) => account.archived);
  const usdBalance = summary.balancesByCurrency?.USD || 0;

  const openCreate = () => { setForm(emptyForm); setModal({ mode: 'create' }); };
  const openEdit = (account) => {
    setForm({ name: account.name, type: account.type, currency: account.currency, initialBalance: account.initialBalance });
    setModal({ mode: 'edit', id: account.id, hasMovements: (data.movements || []).some((movement) => movement.originAccountId === account.id || movement.destinationAccountId === account.id) });
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, initialBalance: Number(form.initialBalance || 0) };
    if (!payload.name.trim()) return;
    if (modal.mode === 'create') addAccount(payload);
    else updateAccount(modal.id, payload);
    setModal(null);
  };

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

      <SectionCard title="Mis cuentas" subtitle="Cada cuenta mantiene su propia moneda y saldo calculado." action={<div className="accounts-section-actions"><button className="btn btn-primary accounts-new-button" onClick={openCreate}><Plus size={17} />Nueva cuenta</button><ViewSwitcher value={view} onChange={setView} options={[{ value: 'cards', label: 'Tarjetas' }, { value: 'list', label: 'Lista' }]} ariaLabel="Formato de cuentas" /></div>}>
        <div className={`account-grid ${view === 'list' ? 'list-view' : ''}`}>
          {activeAccounts.map((account) => {
            const Icon = iconMap[account.type] || Wallet;
            const balance = getAccountBalance(account.id);
            return (
              <article className={`account-card account-card--${account.type} ${account.currency === 'USD' ? 'account-card--usd' : ''}`} key={account.id}>
                <div className="account-card-top"><span className="account-icon"><Icon size={19} /></span><span className="account-currency">{account.currency}</span></div>
                <strong>{account.name}</strong>
                <span className="account-type">{typeOptions.find((item) => item.value === account.type)?.label || account.type}</span>
                <div className="account-balance">{formatMoney(balance, account.currency)}</div>
                <div className="account-actions">
                  <button className="btn btn-outline" onClick={() => openEdit(account)}>Editar</button>
                  <button className="icon-button" title={Math.abs(balance) < 0.000001 ? 'Archivar cuenta' : 'Solo puedes archivar una cuenta con saldo cero'} disabled={Math.abs(balance) >= 0.000001} onClick={() => archiveAccount(account.id)}><Archive size={16} /></button>
                </div>
              </article>
            );
          })}
          {!activeAccounts.length && <div className="empty-state"><strong>No tienes cuentas activas</strong><span>Agrega la primera cuenta para empezar a calcular tu balance real.</span></div>}
        </div>
      </SectionCard>

      {archivedAccounts.length > 0 && (
        <SectionCard title="Archivadas" subtitle="Se conservan para mantener el historial.">
          <div className="archived-list">
            {archivedAccounts.map((account) => <div key={account.id}><span>{account.name}</span><span>{formatMoney(getAccountBalance(account.id), account.currency)}</span></div>)}
          </div>
        </SectionCard>
      )}

      {modal && <Modal title={modal.mode === 'create' ? 'Nueva cuenta' : 'Editar cuenta'} description="El saldo real se calcula con el saldo inicial y los movimientos confirmados." onClose={() => setModal(null)}>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="account-name">Nombre</label><input id="account-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. BAC Principal" required /></div>
            <div className="form-field"><label>Tipo</label><CustomSelect ariaLabel="Tipo de cuenta" value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={typeOptions} className="modal-select" /></div>
            <div className="form-field"><label>Moneda</label><CustomSelect ariaLabel="Moneda de la cuenta" value={form.currency} onChange={(value) => setForm({ ...form, currency: value })} options={currencyOptions} className="modal-select" /></div>
            <div className="form-field"><label htmlFor="account-balance">Saldo inicial</label><input id="account-balance" type="number" min="0" step="0.01" value={form.initialBalance} disabled={modal.mode === 'edit' && modal.hasMovements} onChange={(e) => setForm({ ...form, initialBalance: e.target.value })} placeholder="0" required />{modal.mode === 'edit' && modal.hasMovements && <p className="account-form-help">Esta cuenta ya tiene movimientos. Para corregir su saldo real usaremos un ajuste de saldo, no cambiaremos el saldo inicial.</p>}</div>
          </div>
          <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button><button type="submit" className="btn btn-primary">{modal.mode === 'create' ? 'Crear cuenta' : 'Guardar cambios'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
