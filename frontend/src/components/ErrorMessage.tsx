import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" data-testid="error-message" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" id="retryBtn" className="error-message__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
