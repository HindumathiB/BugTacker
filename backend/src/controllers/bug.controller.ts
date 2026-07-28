import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import * as bugService from '../services/bug.service';
import { BUG_PRIORITIES, BUG_SEVERITIES, BUG_STATUSES, CreateBugInput, UpdateBugInput } from '../types/bug.types';

function validateCreateInput(body: Record<string, unknown>): CreateBugInput {
  const { title, description, severity, priority, assignedTo, status } = body;

  if (typeof title !== 'string' || !title.trim()) {
    throw ApiError.badRequest('Title is required');
  }

  if (typeof severity !== 'string' || !BUG_SEVERITIES.includes(severity as never)) {
    throw ApiError.badRequest(`Severity must be one of: ${BUG_SEVERITIES.join(', ')}`);
  }

  if (typeof priority !== 'string' || !BUG_PRIORITIES.includes(priority as never)) {
    throw ApiError.badRequest(`Priority must be one of: ${BUG_PRIORITIES.join(', ')}`);
  }

  if (typeof assignedTo !== 'string' || !assignedTo.trim()) {
    throw ApiError.badRequest('Assigned To is required');
  }

  if (typeof status !== 'string' || !BUG_STATUSES.includes(status as never)) {
    throw ApiError.badRequest(`Status must be one of: ${BUG_STATUSES.join(', ')}`);
  }

  return {
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    severity: severity as CreateBugInput['severity'],
    priority: priority as CreateBugInput['priority'],
    assignedTo: assignedTo.trim(),
    status: status as CreateBugInput['status'],
  };
}

function validateUpdateInput(body: Record<string, unknown>): UpdateBugInput {
  const input: UpdateBugInput = {};

  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      throw ApiError.badRequest('Title cannot be empty');
    }
    input.title = body.title.trim();
  }

  if (body.description !== undefined) {
    input.description = typeof body.description === 'string' ? body.description.trim() : '';
  }

  if (body.severity !== undefined) {
    if (typeof body.severity !== 'string' || !BUG_SEVERITIES.includes(body.severity as never)) {
      throw ApiError.badRequest(`Severity must be one of: ${BUG_SEVERITIES.join(', ')}`);
    }
    input.severity = body.severity as UpdateBugInput['severity'];
  }

  if (body.priority !== undefined) {
    if (typeof body.priority !== 'string' || !BUG_PRIORITIES.includes(body.priority as never)) {
      throw ApiError.badRequest(`Priority must be one of: ${BUG_PRIORITIES.join(', ')}`);
    }
    input.priority = body.priority as UpdateBugInput['priority'];
  }

  if (body.assignedTo !== undefined) {
    if (typeof body.assignedTo !== 'string' || !body.assignedTo.trim()) {
      throw ApiError.badRequest('Assigned To cannot be empty');
    }
    input.assignedTo = body.assignedTo.trim();
  }

  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !BUG_STATUSES.includes(body.status as never)) {
      throw ApiError.badRequest(`Status must be one of: ${BUG_STATUSES.join(', ')}`);
    }
    input.status = body.status as UpdateBugInput['status'];
  }

  return input;
}

export const getBugsController = asyncHandler(async (_req: Request, res: Response) => {
  const [bugs, stats] = await Promise.all([bugService.getAllBugs(), bugService.getBugStats()]);
  res.status(200).json({ bugs, stats });
});

export const getBugByIdController = asyncHandler(async (req: Request, res: Response) => {
  const bug = await bugService.getBugById(req.params.id);
  res.status(200).json(bug);
});

export const createBugController = asyncHandler(async (req: Request, res: Response) => {
  const input = validateCreateInput(req.body ?? {});
  const bug = await bugService.createBug(input);
  res.status(201).json(bug);
});

export const updateBugController = asyncHandler(async (req: Request, res: Response) => {
  const input = validateUpdateInput(req.body ?? {});
  const bug = await bugService.updateBug(req.params.id, input);
  res.status(200).json(bug);
});

export const deleteBugController = asyncHandler(async (req: Request, res: Response) => {
  await bugService.deleteBug(req.params.id);
  res.status(200).json({ message: 'Bug deleted successfully' });
});
