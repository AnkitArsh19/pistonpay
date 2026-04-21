export default function Card({ label, value }) {
  return (
    <div className="stat-card">
      <label>{label}</label>
      <div className="value">{value}</div>
    </div>
  );
}
