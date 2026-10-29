import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { AppError } from '../utils/AppError.js';
import { mockStore } from './mockStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const taskService = {
  /**
   * Create a new task within a workspace
   */
  async createTask(workspaceId, taskData) {
    if (!isDBConnected()) {
      return await mockStore.createTask(workspaceId, taskData);
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new AppError(`Invalid workspace ID: ${workspaceId}`, 400, 'INVALID_IDENTIFIER');
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new AppError(`Workspace with ID '${workspaceId}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
    }

    if (taskData.assigneeId) {
      const user = await User.findById(taskData.assigneeId);
      if (!user) {
        throw new AppError(`Assignee with ID '${taskData.assigneeId}' not found.`, 404, 'USER_NOT_FOUND');
      }
    }

    const task = await Task.create({
      ...taskData,
      workspaceId,
    });

    const populatedTask = await Task.findById(task._id).populate('assignee', 'name email avatar');
    const taskObj = populatedTask.toObject({ virtuals: true });
    return {
      ...taskObj,
      key: taskObj.key || `DP-${taskObj._id.toString().slice(-4).toUpperCase()}`,
    };
  },

  /**
   * List tasks for a workspace with compound-indexed filtering and pagination
   */
  async getTasks(workspaceId, queryParams = {}) {
    if (!isDBConnected()) {
      return await mockStore.getTasks(workspaceId, queryParams);
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new AppError(`Invalid workspace ID: ${workspaceId}`, 400, 'INVALID_IDENTIFIER');
    }

    const { status, priority, search, page = 1, limit = 20 } = queryParams;

    const query = { workspaceId: new mongoose.Types.ObjectId(workspaceId) };

    if (status) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else if (status.includes(',')) {
        query.status = { $in: status.split(',').map((s) => s.trim()) };
      } else {
        query.status = status.trim();
      }
    }

    if (priority) {
      if (Array.isArray(priority)) {
        query.priority = { $in: priority };
      } else if (priority.includes(',')) {
        query.priority = { $in: priority.split(',').map((p) => p.trim()) };
      } else {
        query.priority = priority.trim();
      }
    }

    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Default sorting by createdAt descending (-1), using compound index { workspaceId: 1, status: 1, createdAt: -1 }
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('assignee', 'name email avatar')
        .lean({ virtuals: true }),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    const formattedTasks = tasks.map((t) => ({
      ...t,
      key: t.key || `DP-${t._id.toString().slice(-4).toUpperCase()}`,
    }));

    return {
      tasks: formattedTasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    };
  },

  /**
   * Get single task details
   */
  async getTaskById(id) {
    if (!isDBConnected()) {
      const task = await mockStore.getTaskById(id);
      if (!task) {
        throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
      }
      return task;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid task ID: ${id}`, 400, 'INVALID_IDENTIFIER');
    }

    const task = await Task.findById(id).populate('assignee', 'name email avatar');
    if (!task) {
      throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
    }

    const taskObj = task.toObject({ virtuals: true });
    return {
      ...taskObj,
      key: taskObj.key || `DP-${taskObj._id.toString().slice(-4).toUpperCase()}`,
    };
  },

  /**
   * Update task fields (status, priority, title, description, assignee, tags)
   */
  async updateTask(id, updateData) {
    if (!isDBConnected()) {
      const updated = await mockStore.updateTask(id, updateData);
      if (!updated) {
        throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
      }
      return updated;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid task ID: ${id}`, 400, 'INVALID_IDENTIFIER');
    }

    if (updateData.assigneeId) {
      const user = await User.findById(updateData.assigneeId);
      if (!user) {
        throw new AppError(`Assignee with ID '${updateData.assigneeId}' not found.`, 404, 'USER_NOT_FOUND');
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('assignee', 'name email avatar');

    if (!updatedTask) {
      throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
    }

    const taskObj = updatedTask.toObject({ virtuals: true });
    return {
      ...taskObj,
      key: taskObj.key || `DP-${taskObj._id.toString().slice(-4).toUpperCase()}`,
    };
  },

  /**
   * Delete a task and remove its referenced comments
   */
  async deleteTask(id) {
    if (!isDBConnected()) {
      const res = await mockStore.deleteTask(id);
      if (!res) {
        throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
      }
      return res;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid task ID: ${id}`, 400, 'INVALID_IDENTIFIER');
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      throw new AppError(`Task with ID '${id}' not found.`, 404, 'TASK_NOT_FOUND');
    }

    // Cascade delete comments
    await Comment.deleteMany({ taskId: id });

    return { id, deleted: true };
  },

  /**
   * List comments for a task
   */
  async getComments(taskId) {
    if (!isDBConnected()) {
      return await mockStore.getComments(taskId);
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError(`Invalid task ID: ${taskId}`, 400, 'INVALID_IDENTIFIER');
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(`Task with ID '${taskId}' not found.`, 404, 'TASK_NOT_FOUND');
    }

    const comments = await Comment.find({ taskId })
      .sort({ createdAt: 1 })
      .populate('author', 'name email avatar')
      .lean({ virtuals: true });

    return comments;
  },

  /**
   * Add comment to a task
   */
  async addComment(taskId, commentData) {
    if (!isDBConnected()) {
      return await mockStore.addComment(taskId, commentData);
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError(`Invalid task ID: ${taskId}`, 400, 'INVALID_IDENTIFIER');
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new AppError(`Task with ID '${taskId}' not found.`, 404, 'TASK_NOT_FOUND');
    }

    let authorId = commentData.authorId;

    if (!authorId) {
      if (commentData.authorEmail) {
        let user = await User.findOne({ email: commentData.authorEmail.toLowerCase() });
        if (!user) {
          user = await User.create({
            name: commentData.authorName || 'DevPulse Member',
            email: commentData.authorEmail.toLowerCase(),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              commentData.authorName || 'DevPulse Member'
            )}`,
          });
        }
        authorId = user._id;
      } else {
        // Fallback to first user or workspace owner
        const defaultUser = await User.findOne();
        if (defaultUser) {
          authorId = defaultUser._id;
        } else {
          throw new AppError('Author is required to post a comment.', 400, 'AUTHOR_REQUIRED');
        }
      }
    }

    const comment = await Comment.create({
      content: commentData.content,
      taskId,
      authorId,
    });

    const populated = await Comment.findById(comment._id).populate('author', 'name email avatar');
    return populated;
  },
};
