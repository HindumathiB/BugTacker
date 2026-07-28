import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBugs } from '../../hooks/useBugs';
import { StatCard } from '../../components/StatCard';
import { BugTable } from '../../components/BugTable';
import { Loader } from '../../components/Loader';
import { ErrorMessage } from '../../components/ErrorMessage';
import './Dashboard.css';

const RECENT_BUGS_LIMIT = 5;

export function Dashboard() {
  const { user, logout } = useAuth();
  const { bugs, stats, isLoading, error, refetch } = useBugs();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const recentBugs = bugs.slice(0, RECENT_BUGS_LIMIT);

  return (
    <div data-testid="dashboard-page">
      <div className="page-header">
        <h1 className="page-header__title" data-testid="welcome-heading">
          Welcome {user?.name ?? 'Admin'}
        </h1>
        <div className="page-header__actions">
          <button
            type="button"
            id="createBugBtn"
            className="btn btn--primary"
            onClick={() => navigate('/bugs/create')}
          >
            Create Bug
          </button>
          <button type="button" id="logoutBtn" className="btn btn--secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {isLoading ? (
        <Loader label="Loading dashboard..." />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard id="totalBugsCard" label="Total Bugs" value={stats?.total ?? 0} variant="total" />
            <StatCard id="openBugsCard" label="Open Bugs" value={stats?.open ?? 0} variant="open" />
            <StatCard id="inProgressBugsCard" label="In Progress" value={stats?.inProgress ?? 0} variant="in-progress" />
            <StatCard id="closedBugsCard" label="Closed Bugs" value={stats?.closed ?? 0} variant="closed" />
          </div>

          <h2 className="section-title">Recent Bugs</h2>
          <BugTable bugs={recentBugs} />
        </>
      )}
    </div>
  );
}
