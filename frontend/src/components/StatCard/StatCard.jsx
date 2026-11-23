import './StatCard.css';

export default function StatCard({ label, value, change, icon: Icon, positive = true, tone = 'mint', action, changeBubble = false, changeIcon: ChangeIcon, progress }) {
  return (
    <div className={`stat-card card stat-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={17} />}</div>
      <div className="stat-copy">
        <span>{label}</span>
        <div className={changeBubble ? 'stat-value-row' : undefined}>
          <strong>{value}</strong>
          {changeBubble && <small className={positive ? 'up' : 'down'}>{ChangeIcon && <ChangeIcon size={9} strokeWidth={2.8} />}{change}</small>}
        </div>
        {!changeBubble && (progress == null ? <small className={positive ? 'up' : 'down'}>{change}</small> : <div className="stat-progress-row"><div className="stat-progress-track"><div className="stat-progress-fill" style={{ width: `${progress}%` }} /></div><small className="stat-progress-value">{progress}%</small></div>)}
      </div>
      {action}
    </div>
  );
}
