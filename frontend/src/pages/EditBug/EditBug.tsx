import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BugForm } from '../../components/BugForm';
import { Loader } from '../../components/Loader';
import { ErrorMessage } from '../../components/ErrorMessage';
import { fetchBugById, updateBugRequest } from '../../services/bug.service';
import { getErrorMessage } from '../../services/api';
import { BugFormValues } from '../../types/bug.types';
import './EditBug.css';

export function EditBug() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<BugFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBug = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const bug = await fetchBugById(id);
      setInitialValues({
        title: bug.title,
        description: bug.description ?? '',
        severity: bug.severity,
        priority: bug.priority,
        assignedTo: bug.assignedTo,
        status: bug.status,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBug();
  }, [loadBug]);

  async function handleSubmit(values: BugFormValues) {
    if (!id) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await updateBugRequest(id, values);
      navigate(`/bugs/${id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Loader label="Loading bug..." />;
  }

  if (error && !initialValues) {
    return <ErrorMessage message={error} onRetry={loadBug} />;
  }

  if (!initialValues) {
    return null;
  }

  return (
    <div data-testid="edit-bug-page">
      <div className="page-header">
        <h1 className="page-header__title">Edit Bug</h1>
      </div>

      <div className="page-card">
        {error && <ErrorMessage message={error} />}
        <BugForm
          initialValues={initialValues}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/bugs/${id}`)}
        />
      </div>
    </div>
  );
}
