import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found" data-testid="not-found-page">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">The page you're looking for doesn't exist.</p>
      <button type="button" id="goHomeBtn" className="btn btn--primary" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}
