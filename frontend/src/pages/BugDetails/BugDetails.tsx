import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../components/Badge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Loader } from '../../components/Loader';
import { ErrorMessage } from '../../components/ErrorMessage';
import { deleteBugRequest, fetchBugById, updateBugRequest } from '../../services/bug.service';
import { getErrorMessage } from '../../services/api';
import { Bug } from '../../types/bug.types';
import './BugDetails.css';

export function BugDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bug, setBug] = useState<Bug | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const loadBug = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBugById(id);
      setBug(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBug();
  }, [loadBug]);

  async function handleCloseBug() {
    if (!bug) return;
    setIsMutating(true);
    try {
      const updated = await updateBugRequest(bug._id, {
        title: bug.title,
        description: bug.description ?? '',
        severity: bug.severity,
        priority: bug.priority,
        assignedTo: bug.assignedTo,
        status: 'Closed',
      });
      setBug(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!bug) return;
    setIsMutating(true);
    try {
      await deleteBugRequest(bug._id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsMutating(false);
      setIsDeleteDialogOpen(false);
    }
  }

  if (isLoading) {
    return <Loader label="Loading bug details..." />;
  }

  if (error && !bug) {
    return <ErrorMessage message={error} onRetry={loadBug} />;
  }

  if (!bug) {
    return null;
  }

  return (
    <div data-testid="bug-details-page">
      <div className="page-header">
        <h1 className="page-header__title">{bug.title}</h1>
        <div className="page-header__actions">
          <button
            type="button"
            id="editBugBtn"
            className="btn btn--secondary"
            onClick={() => navigate(`/bugs/edit/${bug._id}`)}
          >
            Edit
          </button>
          <button
            type="button"
            id="closeBugBtn"
            className="btn btn--success"
            onClick={handleCloseBug}
            disabled={bug.status === 'Closed' || isMutating}
          >
            Close Bug
          </button>
          <button
            type="button"
            id="deleteBugBtn"
            className="btn btn--danger"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isMutating}
          >
            Delete
          </button>
          <button type="button" id="backBtn" className="btn btn--secondary" onClick={() => navigate('/dashboard')}>
            Back
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="page-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-item__label">Severity</span>
            <span className="detail-item__value">
              <Badge text={bug.severity} kind="severity" />
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-item__label">Priority</span>
            <span className="detail-item__value">
              <Badge text={bug.priority} kind="priority" />
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-item__label">Status</span>
            <span className="detail-item__value" data-testid="bug-status">
              <Badge text={bug.status} kind="status" />
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-item__label">Assigned To</span>
            <span className="detail-item__value">{bug.assignedTo}</span>
          </div>
          <div className="detail-item">
            <span className="detail-item__label">Created</span>
            <span className="detail-item__value">{new Date(bug.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-item__label">Last Updated</span>
            <span className="detail-item__value">{new Date(bug.updatedAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-item__label">Description</span>
          <p className="detail-description">{bug.description || 'No description provided.'}</p>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmDialog
          title="Delete Bug"
          message={`Are you sure you want to delete "${bug.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </div>
  );
}
