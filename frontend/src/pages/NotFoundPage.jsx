import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The page you requested does not exist in this frontend.</p>
      <Link className="button button--primary" to="/">Return to overview</Link>
    </div>
  );
}
