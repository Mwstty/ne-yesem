interface Opt<T> { id: T; icon: string; label: string }

interface Props<T extends string | number> {
  options: readonly Opt<T>[];
  selected: T[];
  onToggle: (id: T) => void;
  columns?: number;
}

export default function OptionGrid<T extends string | number>({ options, selected, onToggle, columns = 2 }: Props<T>) {
  return (
    <div className="grid" style={{ ['--cols' as string]: columns }}>
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          className={`opt${selected.includes(o.id) ? ' on' : ''}`}
          onClick={() => onToggle(o.id)}
          aria-pressed={selected.includes(o.id)}
        >
          <span className="opt-icon">{o.icon}</span>
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
