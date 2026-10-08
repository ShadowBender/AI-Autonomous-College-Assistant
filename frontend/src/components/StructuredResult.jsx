import { formatLabel } from '../utils/formatters';

function Primitive({ value }) {
  if (value === null || value === undefined || value === '') return <span className="muted">Not provided</span>;
  if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
  return <span>{String(value)}</span>;
}

function Value({ value, depth = 0 }) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="muted">No items</span>;
    return (
      <div className="result-list">
        {value.map((item, index) => (
          <div className="result-list__item" key={`${depth}-${index}`}>
            {typeof item === 'object' && item !== null ? <Value value={item} depth={depth + 1} /> : <Primitive value={item} />}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="result-grid">
        {Object.entries(value).map(([key, item]) => (
          <div className="result-field" key={key}>
            <div className="result-field__label">{formatLabel(key)}</div>
            <Value value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return <Primitive value={value} />;
}

export default function StructuredResult({ data }) {
  return <div className="structured-result"><Value value={data} /></div>;
}
