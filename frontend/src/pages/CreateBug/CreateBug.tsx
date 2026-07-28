import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BugForm } from '../../components/BugForm';
import { ErrorMessage } from '../../components/ErrorMessage';
import { createBugRequest } from '../../services/bug.service';
import { getErrorMessage } from '../../services/api';
import { BugFormValues } from '../../types/bug.types';
import './CreateBug.css';

const INITIAL_VALUES: BugFormValues = {
  title: '',
  description: '',
  severity: '',
  priority: '',
  assignedTo: '',
  status: 'Open',
};

export function CreateBug() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: BugFormValues) {
    setError(null);
    setIsSubmitting(true);
    try {
      await createBugRequest(values);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <div data-testid="create-bug-page">
      <div className="page-header">
        <h1 className="page-header__title">Create Bug</h1>
      </div>

      <div className="page-card">
        {error && <ErrorMessage message={error} />}
        <BugForm
          initialValues={INITIAL_VALUES}
          submitLabel="Create"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}
