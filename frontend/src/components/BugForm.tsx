import { FormEvent, useState } from 'react';
import { BUG_PRIORITIES, BUG_SEVERITIES, BUG_STATUSES, BugFormValues } from '../types/bug.types';
import { isBlank } from '../utils/validators';

interface BugFormProps {
  initialValues: BugFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: BugFormValues) => void;
  onCancel: () => void;
}

type FormErrors = Partial<Record<keyof BugFormValues, string>>;

function validate(values: BugFormValues): FormErrors {
  const errors: FormErrors = {};

  if (isBlank(values.title)) {
    errors.title = 'Title is required';
  }

  if (!values.severity) {
    errors.severity = 'Severity is required';
  }

  if (!values.priority) {
    errors.priority = 'Priority is required';
  }

  if (isBlank(values.assignedTo)) {
    errors.assignedTo = 'Assigned To is required';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  return errors;
}

export function BugForm({ initialValues, submitLabel, isSubmitting, onSubmit, onCancel }: BugFormProps) {
  const [values, setValues] = useState<BugFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange<K extends keyof BugFormValues>(field: K, value: BugFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-testid="bug-form">
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Bug Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          data-testid="title-input"
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label className="form-label form-label--optional" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          data-testid="description-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="severity">
          Severity
        </label>
        <select
          id="severity"
          name="severity"
          className={`form-select ${errors.severity ? 'form-select--error' : ''}`}
          value={values.severity}
          onChange={(e) => handleChange('severity', e.target.value as BugFormValues['severity'])}
          data-testid="severity-select"
        >
          <option value="">Select severity</option>
          {BUG_SEVERITIES.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
        {errors.severity && <span className="form-error">{errors.severity}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="priority">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          className={`form-select ${errors.priority ? 'form-select--error' : ''}`}
          value={values.priority}
          onChange={(e) => handleChange('priority', e.target.value as BugFormValues['priority'])}
          data-testid="priority-select"
        >
          <option value="">Select priority</option>
          {BUG_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        {errors.priority && <span className="form-error">{errors.priority}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="assignedTo">
          Assigned To
        </label>
        <input
          id="assignedTo"
          name="assignedTo"
          type="text"
          className={`form-input ${errors.assignedTo ? 'form-input--error' : ''}`}
          value={values.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          data-testid="assignedTo-input"
        />
        {errors.assignedTo && <span className="form-error">{errors.assignedTo}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          className={`form-select ${errors.status ? 'form-select--error' : ''}`}
          value={values.status}
          onChange={(e) => handleChange('status', e.target.value as BugFormValues['status'])}
          data-testid="status-select"
        >
          <option value="">Select status</option>
          {BUG_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && <span className="form-error">{errors.status}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" id="createBugSubmitBtn" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <button type="button" id="cancelBtn" className="btn btn--secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
