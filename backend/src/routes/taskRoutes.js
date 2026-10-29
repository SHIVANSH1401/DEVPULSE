import express from 'express';
import {
  getTask,
  updateTask,
  deleteTask,
  getComments,
  addComment,
} from '../controllers/taskController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  updateTaskSchema,
  createCommentSchema,
} from '../validators/schemas.js';

const router = express.Router();

// Task comments endpoints
router.get('/:taskId/comments', getComments);
router.post('/:taskId/comments', validateRequest(createCommentSchema), addComment);

// Single task endpoints
router.get('/:id', getTask);
router.patch('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
