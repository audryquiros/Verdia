import './StatCard.css';

export default function StatCard({ label, value, change, icon: Icon, positive = true, tone = 'mint', action }) {
  return (
    <div className={`stat-card card stat-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={17} />}</div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={positive ? 'up' : 'down'}>{change}</small>
      </div>
      {action}
    </div>
  );
}
