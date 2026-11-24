import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, Download, CalendarDays, ArrowRight } from 'lucide-react';
import SectionCard from '../../components/SectionCard/SectionCard.jsx';
import PageHeader from '../../components/PageHeader/PageHeader.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import '../SimplePage.css';
import './Reports.css';

const categories = [
  { name: 'Alimentación', percent: '36%', value: '₡67.500', color: '#285E45' },
  { name: 'Transporte', percent: '18%', value: '₡33.000', color: '#7fbd78' },
  { name: 'Servicios', percent: '18%', value: '₡33.000', color: '#f0b084' },
  { name: 'Entretenimiento', percent: '12%', value: '₡22.500', color: '#55bfd2' },
  { name: 'Otros', percent: '17%', value: '₡31.350', color: '#a9d29a' },
];

const periods = [
  'Noviembre de 2026',
  'Octubre de 2026',
  'Septiembre de 2026',
  'Agosto de 2026',
  'Julio de 2026',
];

const categoryWeeklySpending = {
  Alimentación: [15, 18, 14, 22, 8],
  Transporte: [8, 10, 9, 12, 4],
  Servicios: [6, 7, 8, 9, 3],
  Entretenimiento: [5, 4, 5, 7, 2],
  Otros: [4, 6, 4, 5, 5],
};

const weekLabels = ['1–7 días', '8–14 días', '15–21 días', '22–28 días', '29–30 días'];

export default function Reports() {
  const [period, setPeriod] = useState('Noviembre de 2026');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const selectedCategoryData = selectedCategory === 'Todas'
    ? null
    : categories.find((category) => category.name === selectedCategory);

  const chartValues = selectedCategory === 'Todas'
    ? weekLabels.map((_, index) =>
        Object.values(categoryWeeklySpending).reduce((total, values) => total + values[index], 0)
      )
    : categoryWeeklySpending[selectedCategory];

  const chartColor = selectedCategoryData?.color ?? '#285E45';
  const maxWeeklyValue = Math.max(20, Math.ceil(Math.max(...chartValues) / 10) * 10);
  const chartScaleLabels = [maxWeeklyValue, Math.round(maxWeeklyValue * 2 / 3), Math.round(maxWeeklyValue / 3), 0];

  const selectedTotal = selectedCategory === 'Todas'
    ? 187350
    : Number(selectedCategoryData?.value.replace(/[₡.]/g, '') || 0);

  const selectedPeak = Math.max(...chartValues);
  const peakIndex = chartValues.indexOf(selectedPeak);

  return (
    <div className="simple-page reports-page">
      <PageHeader />

      <div className="reports-toolbar">
        <div className="reports-period-wrap">
          <CalendarDays size={15} aria-hidden="true" />
          <span>Periodo</span>
          <CustomSelect
            className="reports-period"
            ariaLabel="Seleccionar periodo del reporte"
            value={period}
            onChange={setPeriod}
            options={periods}
          />
        </div>
        <button className="report-download" type="button" onClick={() => downloadDemoReport(period)}>
          <Download size={15} />
          Descargar reporte
        </button>
      </div>

      <div className="report-stats">
        <Stat icon={ArrowUp} label="Ingresos" value="₡620.000" tone="income" />
        <Stat icon={ArrowDown} label="Gastos" value="₡187.350" tone="expense" />
        <Stat icon={TrendingUp} label="Ahorro" value="₡172.650" tone="savings" />
      </div>

      <div className="report-grid">
        <SectionCard
          className="reports-card"
          title="Gastos por categoría"
          subtitle="Identifica en qué categorías se concentra tu gasto."
        >
          <div className="category-content">
            <div className="report-donut-wrap">
              <div className="report-donut" aria-label="Distribución de gastos por categoría">
                <div className="report-donut-inner">
                  <strong>₡187.350</strong>
                  <span>Gastos</span>
                </div>
              </div>
            </div>

            <div className="category-legend">
              {categories.map((category) => (
                <div className="category-row" key={category.name}>
                  <span className="category-dot" style={{ background: category.color }} />
                  <span className="category-name">{category.name}</span>
                  <span className="category-percent">{category.percent}</span>
                  <span className="category-value">{category.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="reports-card evolution-card"
          title="Evolución del gasto"
          subtitle={`Observa cómo evolucionó tu gasto${selectedCategory === 'Todas' ? '' : ` en ${selectedCategory.toLowerCase()}`} durante ${period.toLowerCase()}.`}
        >
          <div className="evolution-controls">
            <label htmlFor="report-category-select">Categoría</label>
            <CustomSelect
              className="report-category-select"
              ariaLabel="Filtrar evolución del gasto por categoría"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={['Todas', ...categories.map((category) => category.name)]}
            />
          </div>

          <div className="monthly-content">
            <div
              className="spending-chart single-category-chart"
              style={{ '--chart-color': chartColor }}
              aria-label={`Evolución semanal de gastos ${selectedCategory === 'Todas' ? 'totales' : `de ${selectedCategory}`} durante ${period}`}
            >
              <div className="chart-y-labels" aria-hidden="true">
                {chartScaleLabels.map((value) => <span key={value}>₡{value}k</span>)}
              </div>

              <div className="chart-main">
                <div className="chart-gridlines" aria-hidden="true">
                  <span></span><span></span><span></span><span></span>
                </div>

                <svg
                  className="spending-line"
                  viewBox="0 0 500 170"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`Gasto por semana: ${chartValues.join(', ')} mil colones`}
                >
                  <defs>
                    <linearGradient id="spendingFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity="0.18" />
                      <stop offset="100%" stopColor={chartColor} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path
                    className="spending-area"
                    d={buildAreaPath(chartValues, maxWeeklyValue)}
                  />
                  <path
                    className="spending-path"
                    d={buildLinePath(chartValues, maxWeeklyValue)}
                  />
                  {chartValues.map((value, index) => {
                    const point = getChartPoint(index, value, chartValues.length, maxWeeklyValue);
                    return (
                      <circle
                        key={`${selectedCategory}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r="4.5"
                      />
                    );
                  })}
                </svg>

                <div className="chart-values">
                  {chartValues.map((value, index) => (
                    <span key={`${selectedCategory}-value-${index}`}>₡{value}.000</span>
                  ))}
                </div>

                <div className="chart-labels">
                  {weekLabels.map((label) => <span key={label}>{label}</span>)}
                </div>
              </div>
            </div>

            <div className="spending-summary evolution-summary">
              <div className="evolution-total">
                <strong>₡{selectedTotal.toLocaleString('es-CR')}</strong>
                <span>{selectedCategory === 'Todas' ? 'Gasto total del periodo' : `Gasto en ${selectedCategory.toLowerCase()}`}</span>
              </div>
              <p className="evolution-peak">
                Mayor gasto: <strong>{weekLabels[peakIndex]}</strong>
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="report-insights">
        <SectionCard
          className="insight-card"
          title="Comparación del mes"
          subtitle="Compara tu gasto actual con el periodo anterior."
        >
          <div className="insight-main">
            <span className="insight-icon"><ArrowRight size={16} /></span>
            <div>
              <strong>Gastos 12% por debajo</strong>
              <p>Comparado con octubre de 2026.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="insight-card plan-confirmed-card"
          title="¿Cuánto de lo planificado ya ocurrió?"
          subtitle="Compara lo que esperabas gastar con lo que ya está confirmado."
        >
          <div className="plan-confirmed-summary">
            <div className="plan-confirmed-percent">
              <strong>89%</strong>
              <span>confirmado</span>
            </div>
            <div className="plan-confirmed-values">
              <div>
                <span>Planificado</span>
                <strong>₡210.000</strong>
              </div>
              <div>
                <span>Confirmado</span>
                <strong>₡187.350</strong>
              </div>
            </div>
          </div>
          <div className="insight-track" aria-label="89 por ciento del monto planificado está confirmado"><span /></div>
          <p className="insight-foot"><strong>₡22.650</strong> todavía falta por confirmar.</p>
        </SectionCard>
      </div>
    </div>
  );
}

function getChartPoint(index, value, count, maxValue) {
  const x = count === 1 ? 250 : 20 + (460 / (count - 1)) * index;
  const y = 160 - ((value / maxValue) * 135);
  return { x, y };
}

function buildLinePath(values, maxValue) {
  return values.map((value, index) => {
    const point = getChartPoint(index, value, values.length, maxValue);
    return `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`;
  }).join(' ');
}

function buildAreaPath(values, maxValue) {
  const line = buildLinePath(values, maxValue);
  const last = getChartPoint(values.length - 1, values[values.length - 1], values.length, maxValue);
  const first = getChartPoint(0, values[0], values.length, maxValue);
  return `${line} L${last.x} 160 L${first.x} 160 Z`;
}

function downloadDemoReport(period) {
  const rows = [
    ['Reporte', period],
    ['Ingresos', '620000'],
    ['Gastos', '187350'],
    ['Ahorro', '172650'],
    [],
    ['Categoría', 'Porcentaje', 'Monto'],
    ...categories.map(({ name, percent, value }) => [name, percent, value]),
  ];
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `verdia-reporte-${period.toLowerCase().replaceAll(' ', '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className={`report-stat card ${tone}`}>
      <span><Icon size={19} strokeWidth={2.2} /></span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
