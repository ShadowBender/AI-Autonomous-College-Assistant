export default function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark">—</div>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children}
    </div>
  );
}
