import { Link } from "react-router-dom";

export default function DashStat({ label, value, sub, icon: Icon, to }) {
  const content = (
    <div className="bg-cream-card dark:bg-dark-card rounded-2xl p-5 border border-charcoal/5 dark:border-dark-border flex items-start justify-between h-full transition-all duration-200 hover:shadow-elevation-1">
      <div>
        <p className="text-sm text-charcoal/55 dark:text-dark-muted">{label}</p>
        <p className="font-display text-2xl mt-1 text-charcoal dark:text-dark-text font-medium">{value}</p>
        {sub && <p className="text-xs text-olive-700 dark:text-olive-400 mt-1 font-medium">{sub}</p>}
      </div>
      {Icon && (
        <span className="w-9 h-9 rounded-xl bg-olive-100 dark:bg-olive-900/40 text-olive-700 dark:text-olive-300 flex items-center justify-center shrink-0">
          <Icon size={16} />
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="block group focus:outline-none">{content}</Link>;
  }
  return content;
}
