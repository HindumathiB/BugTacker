export type BugSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type BugPriority = 'Low' | 'Medium' | 'High';
export type BugStatus = 'Open' | 'In Progress' | 'Closed';

export const BUG_SEVERITIES: BugSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
export const BUG_PRIORITIES: BugPriority[] = ['Low', 'Medium', 'High'];
export const BUG_STATUSES: BugStatus[] = ['Open', 'In Progress', 'Closed'];

export interface CreateBugInput {
  title: string;
  description?: string;
  severity: BugSeverity;
  priority: BugPriority;
  assignedTo: string;
  status: BugStatus;
}

export type UpdateBugInput = Partial<CreateBugInput>;

export interface BugStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}
