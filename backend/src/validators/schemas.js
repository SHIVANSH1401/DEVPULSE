import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Workspace name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
    slug: z.string({ required_error: 'Workspace slug is required' })
      .trim()
      .min(2, 'Slug must be at least 2 characters long')
      .max(50, 'Slug cannot exceed 50 characters')
      .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens'),
    ownerEmail: z.string({ required_error: 'Owner email is required' })
      .trim()
      .email('Please provide a valid email address'),
    ownerName: z.string({ required_error: 'Owner name is required' })
      .trim()
      .min(2, 'Owner name must be at least 2 characters long')
      .max(80, 'Owner name cannot exceed 80 characters'),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Member email is required' })
      .trim()
      .email('Please provide a valid email address'),
    name: z.string({ required_error: 'Member name is required' })
      .trim()
      .min(2, 'Member name must be at least 2 characters long')
      .max(80, 'Member name cannot exceed 80 characters'),
    role: z.enum(['owner', 'admin', 'member'], {
      errorMap: () => ({ message: 'Role must be one of: owner, admin, member' }),
    }).default('member'),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Task title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters long')
      .max(120, 'Title cannot exceed 120 characters'),
    description: z.string().trim().max(2000, 'Description cannot exceed 2000 characters').optional().default(''),
    status: z.enum(['backlog', 'todo', 'in-progress', 'done'], {
      errorMap: () => ({ message: 'Status must be one of: backlog, todo, in-progress, done' }),
    }).default('todo'),
    priority: z.enum(['low', 'medium', 'high', 'urgent'], {
      errorMap: () => ({ message: 'Priority must be one of: low, medium, high, urgent' }),
    }).default('medium'),
    assigneeId: z.string().regex(objectIdRegex, 'Invalid assignee ID format').nullable().optional(),
    tags: z.array(z.string().trim()).optional().default([]),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters long').max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(['backlog', 'todo', 'in-progress', 'done'], {
      errorMap: () => ({ message: 'Status must be one of: backlog, todo, in-progress, done' }),
    }).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent'], {
      errorMap: () => ({ message: 'Priority must be one of: low, medium, high, urgent' }),
    }).optional(),
    assigneeId: z.string().regex(objectIdRegex, 'Invalid assignee ID format').nullable().optional(),
    tags: z.array(z.string().trim()).optional(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Comment content is required' })
      .trim()
      .min(1, 'Comment cannot be empty')
      .max(2000, 'Comment cannot exceed 2000 characters'),
    authorId: z.string().regex(objectIdRegex, 'Invalid author ID format').optional(),
    authorEmail: z.string().trim().email().optional(),
    authorName: z.string().trim().min(2).optional(),
  }),
});
