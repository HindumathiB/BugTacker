import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../services/api';
import { isBlank, isValidEmail } from '../../utils/validators';
import './Login.css';

interface FormErrors {
  email?: string;
  password?: string;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (isBlank(email)) {
      nextErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (isBlank(password)) {
      nextErrors.password = 'Password is required';
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" data-testid="login-card">
        <h1 className="login-card__title">Mini Bug Tracker</h1>
        <p className="login-card__subtitle">Sign in to manage your bugs</p>

        {serverError && (
          <div className="login-card__error" data-testid="login-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" id="loginBtn" className="btn btn--primary btn--full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
