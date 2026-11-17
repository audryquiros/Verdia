import './DonutChart.css';
export default function DonutChart({value='₡187.350',segments=[]}){return <div className="donut" style={{background:`conic-gradient(${segments.join(',')})`}}><div><strong>{value}</strong><span>Gastos</span></div></div>}
