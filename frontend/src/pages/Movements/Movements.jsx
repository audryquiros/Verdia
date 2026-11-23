import { useState } from 'react';
import { Plus, Search, ShoppingBag, ReceiptText, ArrowDownLeft, Car } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import '../SimplePage.css';
import './Movements.css';

const periods = [
  'Noviembre de 2026',
  'Octubre de 2026',
  'Septiembre de 2026',
  'Agosto de 2026',
  'Julio de 2026',
  'Junio de 2026',
  'Mayo de 2026',
  'Abril de 2026',
  'Marzo de 2026',
  'Febrero de 2026',
  'Enero de 2026',
];

export default function Movements() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="simple-page movements-page">
      <PageHeader />

      <SectionCard
        title={null}
        className="movements-page-card"
        action={
          <button className="btn btn-primary movements-new-button">
            <Plus size={20} />
            Nuevo movimiento
          </button>
        }
      >
        <div className="movements-toolbar">
          <div className="filters">
            <button className="filter active">Todos</button>
            <button className="filter">Ingresos</button>
            <button className="filter">Gastos</button>
          </div>

          <div className="movements-tools">
            <CustomSelect
              className="movement-period"
              ariaLabel="Filtrar movimientos por mes y año"
              value="Noviembre de 2026"
              onChange={() => {}}
              options={periods}
            />
            {searchOpen ? (
              <div className="search-expanded">
                <Search size={18} aria-hidden="true" />
                <input autoFocus placeholder="Buscar" aria-label="Buscar movimientos" />
              </div>
            ) : (
              <button
                type="button"
                className="search-toggle"
                aria-label="Buscar movimientos"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="movement-table" role="table" aria-label="Movimientos financieros">
          <div className="table-head" role="row">
            <span>Fecha</span>
            <span>Descripción</span>
            <span>Categoría</span>
            <span className="right">Monto</span>
          </div>

          <MovementRow name="Walmart" category="Alimentación" date="09 nov" amount="₡15.500" icon={ShoppingBag} categoryTone="expense" />
          <MovementRow name="ICE" category="Servicios" date="09 nov" amount="₡28.350" icon={ReceiptText} categoryTone="services" />
          <MovementRow name="Salario" category="Ingreso" date="03 nov" amount="₡620.000" type="income" icon={ArrowDownLeft} categoryTone="income" />
          <MovementRow name="Uber" category="Transporte" date="02 nov" amount="₡6.200" icon={Car} categoryTone="transport" />
        </div>
      </SectionCard>
    </div>
  );
}
