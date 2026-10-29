import { taskService } from '../services/taskService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getTasks = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const result = await taskService.getTasks(workspaceId, req.query);
  res.status(200).json({
    success: true,
    data: result,
    error: null,
  });
});

export const createTask = catchAsync(async (req, res) => {
  const { workspaceId } = req.params;
  const task = await taskService.createTask(workspaceId, req.body);
  res.status(201).json({
    success: true,
    data: task,
    error: null,
  });
});

export const getTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const task = await taskService.getTaskById(id);
  res.status(200).json({
    success: true,
    data: task,
    error: null,
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const task = await taskService.updateTask(id, req.body);
  res.status(200).json({
    success: true,
    data: task,
    error: null,
  });
});

export const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await taskService.deleteTask(id);
  res.status(200).json({
    success: true,
    data: result,
    error: null,
  });
});

export const getComments = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const comments = await taskService.getComments(taskId);
  res.status(200).json({
    success: true,
    data: comments,
    error: null,
  });
});

export const addComment = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const comment = await taskService.addComment(taskId, req.body);
  res.status(201).json({
    success: true,
    data: comment,
    error: null,
  });
});
