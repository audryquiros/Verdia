import { Plus, Search, Filter, ShoppingBag, ReceiptText, ArrowDownLeft, Car } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import MovementRow from '../../components/MovementRow/MovementRow.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import '../SimplePage.css';

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
  return (
    <div className="simple-page movements-page">
      <PageHeader
        action={
          <button className="btn btn-primary movements-new-button">
            <Plus size={18} />
            Nuevo movimiento
          </button>
        }
      />

      <SectionCard title="Movimientos" className="movements-card">
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
            <div className="search">
              <Search size={17} />
              <input placeholder="Buscar" aria-label="Buscar movimientos" />
            </div>
            <button className="icon-filter" aria-label="Filtrar movimientos">
              <Filter size={18} />
            </button>
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
