import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['backlog', 'todo', 'in-progress', 'done'],
        message: 'Status must be one of: backlog, todo, in-progress, done',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent',
      },
      default: 'medium',
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace ID is required'],
      index: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for assignee if needed
TaskSchema.virtual('assignee', {
  ref: 'User',
  localField: 'assigneeId',
  foreignField: '_id',
  justOne: true,
});

// Virtual ticket key identifier (e.g. DP-8F3A) for Linear/Jira style tracking
TaskSchema.virtual('key').get(function () {
  if (this._id) {
    return `DP-${this._id.toString().slice(-4).toUpperCase()}`;
  }
  return 'DP-TASK';
});

// Compound indexing strategy specified in Section 3 of ARCHITECTURE.md
TaskSchema.index(
  { workspaceId: 1, status: 1, createdAt: -1 },
  { name: 'idx_workspace_status_created' }
);

export const Task = mongoose.model('Task', TaskSchema);
