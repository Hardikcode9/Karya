export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="w-8 h-8 rounded-xl bg-olive-700 dark:bg-olive-600 flex items-center justify-center text-white font-display font-black text-lg shadow-xs">
        क
      </div>
      <div>
        <span className="font-display font-bold text-xl tracking-tight text-charcoal dark:text-dark-text block leading-none">
          Karya
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-olive-800 dark:text-olive-300 block mt-0.5">
          Admin Console
        </span>
      </div>
    </div>
  );
}
