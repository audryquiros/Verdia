import './MiniChart.css';
export default function MiniChart({values=[35,42,31,58,70]}){const max=Math.max(...values);return <div className="mini-chart">{values.map((v,i)=><span key={i} style={{height:`${(v/max)*100}%`}}/> )}</div>}
