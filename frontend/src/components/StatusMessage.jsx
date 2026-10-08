export default function StatusMessage({ type = 'info', title, children }) {
  return (
    <div className={`status-message status-message--${type}`} role={type === 'error' ? 'alert' : undefined}>
      <div className="status-message__icon" aria-hidden="true">
        {type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}
      </div>
      <div>
        {title ? <strong>{title}</strong> : null}
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}
