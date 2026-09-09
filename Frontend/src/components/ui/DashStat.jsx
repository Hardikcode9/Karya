export default function DashStat({ label, value, sub, icon: Icon }) {
  return (
    <div className="bg-cream-card rounded-2xl p-5 border border-charcoal/5 flex items-start justify-between">
      <div>
        <p className="text-sm text-charcoal/55">{label}</p>
        <p className="font-display text-2xl mt-1">{value}</p>
        {sub && <p className="text-xs text-olive-700 mt-1">{sub}</p>}
      </div>
      {Icon && (
        <span className="w-9 h-9 rounded-xl bg-olive-100 text-olive-700 flex items-center justify-center shrink-0">
          <Icon size={16} />
        </span>
      )}
    </div>
  );
}
