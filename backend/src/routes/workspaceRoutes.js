import express from 'express';
import {
  createWorkspace,
  getWorkspaceBySlug,
  getAllWorkspaces,
  addMember,
} from '../controllers/workspaceController.js';
import {
  getTasks,
  createTask,
} from '../controllers/taskController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import {
  createWorkspaceSchema,
  addMemberSchema,
  createTaskSchema,
} from '../validators/schemas.js';

const router = express.Router();

// List all workspaces
router.get('/', getAllWorkspaces);

// Create new workspace (rate limited to 20 per minute)
router.post(
  '/',
  rateLimiter({ max: 20, windowMs: 60 * 1000, message: 'Too many workspace creation attempts. Please slow down.' }),
  validateRequest(createWorkspaceSchema),
  createWorkspace
);

// Workspace tasks endpoints: /api/v1/workspaces/:workspaceId/tasks
router.get('/:workspaceId/tasks', getTasks);
router.post('/:workspaceId/tasks', validateRequest(createTaskSchema), createTask);

// Get workspace details & members by slug
router.get('/:slug', getWorkspaceBySlug);

// Add member to workspace by slug (rate limited to 10 invites per minute)
router.post(
  '/:slug/members',
  rateLimiter({ max: 10, windowMs: 60 * 1000, message: 'Too many member invitations sent. Please wait a minute.' }),
  validateRequest(addMemberSchema),
  addMember
);

export default router;
