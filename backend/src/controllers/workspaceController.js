import { workspaceService } from '../services/workspaceService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createWorkspace = catchAsync(async (req, res) => {
  const workspace = await workspaceService.createWorkspace(req.body);
  res.status(201).json({
    success: true,
    data: workspace,
    error: null,
  });
});

export const getWorkspaceBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const workspace = await workspaceService.getWorkspaceBySlug(slug);
  res.status(200).json({
    success: true,
    data: workspace,
    error: null,
  });
});

export const getAllWorkspaces = catchAsync(async (req, res) => {
  const workspaces = await workspaceService.getAllWorkspaces();
  res.status(200).json({
    success: true,
    data: workspaces,
    error: null,
  });
});

export const addMember = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const updatedWorkspace = await workspaceService.addMember(slug, req.body);
  res.status(200).json({
    success: true,
    data: updatedWorkspace,
    error: null,
  });
});
