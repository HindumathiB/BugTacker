import { useNavigate } from 'react-router-dom';
import { Bug } from '../types/bug.types';
import { Badge } from './Badge';
import './BugTable.css';

interface BugTableProps {
  bugs: Bug[];
}

export function BugTable({ bugs }: BugTableProps) {
  const navigate = useNavigate();

  if (bugs.length === 0) {
    return (
      <div className="bug-table__empty" data-testid="bug-table-empty">
        No bugs found. Click "Create Bug" to add one.
      </div>
    );
  }

  return (
    <div className="bug-table-wrapper">
      <table className="bug-table" id="bugTable" data-testid="bug-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Severity</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr
              key={bug._id}
              className="bug-table__row"
              data-testid={`bug-row-${bug._id}`}
              onClick={() => navigate(`/bugs/${bug._id}`)}
            >
              <td className="bug-table__title">{bug.title}</td>
              <td>
                <Badge text={bug.severity} kind="severity" />
              </td>
              <td>
                <Badge text={bug.priority} kind="priority" />
              </td>
              <td>{bug.assignedTo}</td>
              <td>
                <Badge text={bug.status} kind="status" />
              </td>
              <td>{new Date(bug.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
