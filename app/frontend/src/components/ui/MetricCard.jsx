import Card from './Card';

export default function MetricCard({ label, value, valueClassName = '', sub }) {
  return (
    <Card>
      <div className="text-xs text-neutral-500 mb-1.5">{label}</div>
      <div className={`text-[22px] font-extrabold tracking-tight text-neutral-900 ${valueClassName}`}>{value}</div>
      {sub && <div className="text-[11.5px] text-neutral-500 mt-1">{sub}</div>}
    </Card>
  );
}
