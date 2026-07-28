import { Schema, model, Document } from 'mongoose';
import { BUG_PRIORITIES, BUG_SEVERITIES, BUG_STATUSES, BugPriority, BugSeverity, BugStatus } from '../types/bug.types';

export interface IBug extends Document {
  title: string;
  description?: string;
  severity: BugSeverity;
  priority: BugPriority;
  assignedTo: string;
  status: BugStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bugSchema = new Schema<IBug>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    severity: {
      type: String,
      enum: BUG_SEVERITIES,
      required: true,
    },
    priority: {
      type: String,
      enum: BUG_PRIORITIES,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: BUG_STATUSES,
      required: true,
      default: 'Open',
    },
  },
  { timestamps: true }
);

export const Bug = model<IBug>('Bug', bugSchema);
