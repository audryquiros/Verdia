import './ProgressBar.css';
export default function ProgressBar({value=0,showLabel=false}){return <div className="progress-wrap"><div className="progress"><span style={{width:`${Math.min(value,100)}%`}}/></div>{showLabel&&<small>{value}%</small>}</div>}
