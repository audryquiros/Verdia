import './SectionCard.css';
export default function SectionCard({title,subtitle,action,children,className=''}){return <section className={`section-card card ${className}`}><div className="section-title"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>{children}</section>}
