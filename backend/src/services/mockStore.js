import mongoose from 'mongoose';

const mockUsers = [
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7b',
    name: 'Sarah Lead',
    email: 'lead@acme.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7c',
    name: 'Alex Chen',
    email: 'alex.dev@acme.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7d',
    name: 'Maya Patel',
    email: 'maya.qa@acme.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7e',
    name: 'Marcus Johnson',
    email: 'marcus@acme.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7f',
    name: 'Elena Rostova',
    email: 'elena@acme.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

const mockWorkspaces = [
  {
    _id: '671e3b5e4f1a2b3c4d5e6f7a',
    name: 'Acme Engineering',
    slug: 'acme-eng',
    description: 'Core engineering organization for Acme platform and distributed infrastructure.',
    members: [
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7b',
        email: 'lead@acme.com',
        name: 'Sarah Lead',
        role: 'owner',
        joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7c',
        email: 'alex.dev@acme.com',
        name: 'Alex Chen',
        role: 'admin',
        joinedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7d',
        email: 'maya.qa@acme.com',
        name: 'Maya Patel',
        role: 'member',
        joinedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7e',
        email: 'marcus@acme.com',
        name: 'Marcus Johnson',
        role: 'member',
        joinedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7f',
        email: 'elena@acme.com',
        name: 'Elena Rostova',
        role: 'member',
        joinedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    _id: '671e3b5e4f1a2b3c4d5e6f80',
    name: 'DevPulse Core Team',
    slug: 'devpulse-core',
    description: 'Main product team workspace for DevPulse Kanban and multi-tenant orchestration.',
    members: [
      {
        userId: '671e3b5e4f1a2b3c4d5e6f7b',
        email: 'lead@acme.com',
        name: 'Sarah Lead',
        role: 'owner',
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const initialTasks = [
  {
    _id: '671e402e4f1a2b3c4d5e6f81',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Explore WebAssembly for client-side cryptographic hashing',
    description: 'Investigate Rust-compiled Wasm modules to offload client-side hashing calculations.',
    status: 'backlog',
    priority: 'low',
    tags: ['research', 'wasm', 'security'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7b',
    createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f82',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Draft OpenAPI 3.1 specification for external partner APIs',
    description: 'Create standardized OpenAPI documentation for 3rd-party webhook and task synchronization integrations.',
    status: 'backlog',
    priority: 'medium',
    tags: ['api', 'documentation'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7c',
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f83',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Implement AI-assisted task auto-categorization',
    description: 'Train a lightweight model to recommend tags and assignee based on task title and description.',
    status: 'backlog',
    priority: 'low',
    tags: ['ai', 'feature'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7d',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f84',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Set up MongoDB compound indexing',
    description: 'Index on workspaceId, status, and createdAt for < 50ms query resolution under high tenant load.',
    status: 'todo',
    priority: 'urgent',
    tags: ['backend', 'database', 'performance'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7b',
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f85',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Implement Zod request validation pipeline',
    description: 'Validate req.body, req.params, and req.query before passing control to Express controllers.',
    status: 'todo',
    priority: 'high',
    tags: ['backend', 'security', 'zod'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7c',
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f86',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Construct Zero-CLS SkeletonLoaders matching card dimensions',
    description: 'Prevent layout shift during asynchronous data fetching by matching exact CSS dimensions.',
    status: 'todo',
    priority: 'high',
    tags: ['frontend', 'ux', 'performance'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7d',
    createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f87',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Refactor Task Controller into strict Controller-Service pattern',
    description: 'Decouple HTTP request handling from Mongoose query logic to adhere to clean architecture.',
    status: 'in-progress',
    priority: 'urgent',
    tags: ['backend', 'architecture', 'refactor'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7e',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f88',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Build responsive 4-stage interactive Kanban board',
    description: 'Implement drag/drop and instant status toggling with optimistic UI updates.',
    status: 'in-progress',
    priority: 'urgent',
    tags: ['frontend', 'kanban', 'react'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7f',
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f89',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Initialize multi-tier monorepo structure',
    description: 'Set up isolated backend and frontend workspaces with shared scripts.',
    status: 'done',
    priority: 'high',
    tags: ['infrastructure', 'setup'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7b',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f90',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Establish Mongoose schemas for User, Workspace, Task, and Comment',
    description: 'Formulate embedding vs referencing schema rules per architectural specifications.',
    status: 'done',
    priority: 'urgent',
    tags: ['database', 'mongoose'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7c',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f91',
    workspaceId: '671e3b5e4f1a2b3c4d5e6f7a',
    title: 'Implement centralized Express error handling pipeline',
    description: 'Map CastError, DuplicateKey (11000), ZodError, and AppError to standard JSON envelopes.',
    status: 'done',
    priority: 'urgent',
    tags: ['backend', 'error-handling'],
    assigneeId: '671e3b5e4f1a2b3c4d5e6f7d',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

const mockComments = [
  {
    _id: '671e402e4f1a2b3c4d5e6f95',
    taskId: '671e402e4f1a2b3c4d5e6f84',
    authorId: '671e3b5e4f1a2b3c4d5e6f7b',
    content: 'The compound index reduced totalDocsExamined from 40,000 to 20!',
    author: mockUsers[0],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '671e402e4f1a2b3c4d5e6f96',
    taskId: '671e402e4f1a2b3c4d5e6f84',
    authorId: '671e3b5e4f1a2b3c4d5e6f7c',
    content: 'PR opened with unit tests covering status edge cases.',
    author: mockUsers[1],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

class MemoryStore {
  constructor() {
    this.users = [...mockUsers];
    this.workspaces = [...mockWorkspaces];
    this.tasks = [...initialTasks];
    this.comments = [...mockComments];
  }

  generateId() {
    return new mongoose.Types.ObjectId().toString();
  }

  // Workspaces
  async getAllWorkspaces() {
    return [...this.workspaces];
  }

  async getWorkspaceBySlug(slug) {
    const ws = this.workspaces.find((w) => w.slug.toLowerCase() === slug.toLowerCase());
    return ws || null;
  }

  async getWorkspaceById(id) {
    const ws = this.workspaces.find((w) => w._id.toString() === id.toString());
    return ws || null;
  }

  async createWorkspace({ name, slug, ownerEmail, ownerName, description = '' }) {
    let owner = this.users.find((u) => u.email.toLowerCase() === ownerEmail.toLowerCase());
    if (!owner) {
      owner = {
        _id: this.generateId(),
        name: ownerName,
        email: ownerEmail.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ownerName)}`,
      };
      this.users.push(owner);
    }

    const newWs = {
      _id: this.generateId(),
      name,
      slug: slug.toLowerCase(),
      description,
      members: [
        {
          userId: owner._id,
          email: owner.email,
          name: owner.name,
          role: 'owner',
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.workspaces.unshift(newWs);
    return newWs;
  }

  async addMember(slug, { email, name, role = 'member' }) {
    const ws = await this.getWorkspaceBySlug(slug);
    if (!ws) return null;

    let user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        _id: this.generateId(),
        name,
        email: email.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      };
      this.users.push(user);
    }

    ws.members.push({
      userId: user._id,
      email: user.email,
      name: user.name,
      role,
      joinedAt: new Date().toISOString(),
    });

    return ws;
  }

  // Tasks
  async getTasks(workspaceId, queryParams = {}) {
    const { status, priority, search } = queryParams;
    let list = this.tasks.filter((t) => t.workspaceId === workspaceId || !workspaceId);

    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',').map((s) => s.trim());
      list = list.filter((t) => statuses.includes(t.status));
    }

    if (priority) {
      const priorities = Array.isArray(priority) ? priority : priority.split(',').map((p) => p.trim());
      list = list.filter((t) => priorities.includes(t.priority));
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }

    const populated = list.map((t) => {
      const assignee = this.users.find((u) => u._id.toString() === t.assigneeId?.toString()) || null;
      return {
        ...t,
        assignee,
        key: `DP-${t._id.slice(-4).toUpperCase()}`,
      };
    });

    return {
      tasks: populated,
      pagination: {
        page: 1,
        limit: 50,
        total: populated.length,
        totalPages: 1,
      },
    };
  }

  async createTask(workspaceId, taskData) {
    const id = this.generateId();
    const newTask = {
      _id: id,
      workspaceId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || null,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    const assignee = this.users.find((u) => u._id.toString() === newTask.assigneeId?.toString()) || null;
    return {
      ...newTask,
      assignee,
      key: `DP-${id.slice(-4).toUpperCase()}`,
    };
  }

  async getTaskById(id) {
    const t = this.tasks.find((task) => task._id.toString() === id.toString());
    if (!t) return null;
    const assignee = this.users.find((u) => u._id.toString() === t.assigneeId?.toString()) || null;
    return {
      ...t,
      assignee,
      key: `DP-${t._id.slice(-4).toUpperCase()}`,
    };
  }

  async updateTask(id, updateData) {
    const idx = this.tasks.findIndex((t) => t._id.toString() === id.toString());
    if (idx === -1) return null;

    this.tasks[idx] = {
      ...this.tasks[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const updated = this.tasks[idx];
    const assignee = this.users.find((u) => u._id.toString() === updated.assigneeId?.toString()) || null;
    return {
      ...updated,
      assignee,
      key: `DP-${updated._id.slice(-4).toUpperCase()}`,
    };
  }

  async deleteTask(id) {
    const idx = this.tasks.findIndex((t) => t._id.toString() === id.toString());
    if (idx === -1) return null;
    this.tasks.splice(idx, 1);
    this.comments = this.comments.filter((c) => c.taskId.toString() !== id.toString());
    return { id, deleted: true };
  }

  // Comments
  async getComments(taskId) {
    return this.comments
      .filter((c) => c.taskId.toString() === taskId.toString())
      .map((c) => ({
        ...c,
        author: this.users.find((u) => u._id.toString() === c.authorId?.toString()) || c.author || null,
      }));
  }

  async addComment(taskId, commentData) {
    const id = this.generateId();
    let author = this.users.find((u) => u.email.toLowerCase() === commentData.authorEmail?.toLowerCase());
    if (!author) {
      author = this.users[0];
    }

    const newComment = {
      _id: id,
      taskId,
      authorId: author._id,
      content: commentData.content,
      author,
      createdAt: new Date().toISOString(),
    };

    this.comments.push(newComment);
    return newComment;
  }
}

export const mockStore = new MemoryStore();
