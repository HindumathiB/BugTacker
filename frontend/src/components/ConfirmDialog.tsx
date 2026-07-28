import './ConfirmDialog.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog__overlay" data-testid="confirm-dialog-overlay">
      <div className="confirm-dialog" role="dialog" aria-modal="true" data-testid="confirm-dialog">
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" id="confirmCancelBtn" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" id="confirmOkBtn" className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
