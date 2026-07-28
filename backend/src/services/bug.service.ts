import { Bug, IBug } from '../models/Bug';
import { ApiError } from '../utils/ApiError';
import { BugStats, CreateBugInput, UpdateBugInput } from '../types/bug.types';

export async function getAllBugs(): Promise<IBug[]> {
  return Bug.find().sort({ createdAt: -1 });
}

export async function getBugById(id: string): Promise<IBug> {
  const bug = await Bug.findById(id).catch(() => null);

  if (!bug) {
    throw ApiError.notFound('Bug not found');
  }

  return bug;
}

export async function createBug(input: CreateBugInput): Promise<IBug> {
  return Bug.create(input);
}

export async function updateBug(id: string, input: UpdateBugInput): Promise<IBug> {
  const bug = await Bug.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).catch(() => null);

  if (!bug) {
    throw ApiError.notFound('Bug not found');
  }

  return bug;
}

export async function deleteBug(id: string): Promise<void> {
  const bug = await Bug.findByIdAndDelete(id).catch(() => null);

  if (!bug) {
    throw ApiError.notFound('Bug not found');
  }
}

export async function getBugStats(): Promise<BugStats> {
  const [total, open, inProgress, closed] = await Promise.all([
    Bug.countDocuments(),
    Bug.countDocuments({ status: 'Open' }),
    Bug.countDocuments({ status: 'In Progress' }),
    Bug.countDocuments({ status: 'Closed' }),
  ]);

  return { total, open, inProgress, closed };
}
