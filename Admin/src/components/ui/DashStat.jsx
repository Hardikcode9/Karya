export default function DashStat({ label, value, icon: Icon, change }) {
  return (
    <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
      <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
        <span>{label}</span>
        {Icon && <Icon size={16} className="text-olive-700 dark:text-olive-400" />}
      </div>
      <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
        {value}
      </div>
      {change && (
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
          {change}
        </div>
      )}
    </div>
  );
}
