import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, closeDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Workspace } from '../src/models/Workspace.js';
import { Task } from '../src/models/Task.js';
import { Comment } from '../src/models/Comment.js';

const mockUsers = [
  {
    name: 'Sarah Lead',
    email: 'lead@acme.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    name: 'Alex Chen',
    email: 'alex.dev@acme.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  },
  {
    name: 'Maya Patel',
    email: 'maya.qa@acme.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@acme.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@acme.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
];

const mockTasksData = [
  // BACKLOG
  {
    title: 'Explore WebAssembly for client-side cryptographic hashing',
    description: 'Investigate Rust-compiled Wasm modules to offload client-side hashing calculations.',
    status: 'backlog',
    priority: 'low',
    tags: ['research', 'wasm', 'security'],
  },
  {
    title: 'Draft OpenAPI 3.1 specification for external partner APIs',
    description: 'Create standardized OpenAPI documentation for 3rd-party webhook and task synchronization integrations.',
    status: 'backlog',
    priority: 'medium',
    tags: ['api', 'documentation'],
  },
  {
    title: 'Implement AI-assisted task auto-categorization',
    description: 'Train a lightweight model to recommend tags and assignee based on task title and description.',
    status: 'backlog',
    priority: 'low',
    tags: ['ai', 'feature'],
  },
  {
    title: 'Evaluate Elasticsearch vs MongoDB Atlas Search',
    description: 'Benchmark query throughput for full-text search across 1,000,000+ comment records.',
    status: 'backlog',
    priority: 'medium',
    tags: ['database', 'search', 'benchmark'],
  },
  {
    title: 'Migrate legacy SVG icons to Lucide React sprite system',
    description: 'Reduce frontend bundle size by consolidating 80+ inline SVGs into a single cached SVG sprite.',
    status: 'backlog',
    priority: 'low',
    tags: ['frontend', 'performance'],
  },
  {
    title: 'Setup canary deployment pipeline on Vercel',
    description: 'Configure percentage-based traffic routing for Module 2 feature rollout.',
    status: 'backlog',
    priority: 'medium',
    tags: ['devops', 'ci-cd'],
  },
  {
    title: 'Support markdown preview in task description editor',
    description: 'Integrate markdown rendering for checklists, code blocks, and formatted lists in task details.',
    status: 'backlog',
    priority: 'low',
    tags: ['frontend', 'ux'],
  },
  {
    title: 'Investigate Redis caching layer for workspace stats',
    description: 'Determine memory footprint and TTL policy for tenant aggregation metrics.',
    status: 'backlog',
    priority: 'medium',
    tags: ['backend', 'cache'],
  },

  // TODO
  {
    title: 'Set up MongoDB compound indexing',
    description: 'Index on workspaceId, status, and createdAt for < 50ms query resolution under high tenant load.',
    status: 'todo',
    priority: 'urgent',
    tags: ['backend', 'database', 'performance'],
  },
  {
    title: 'Implement Zod request validation pipeline',
    description: 'Validate req.body, req.params, and req.query before passing control to Express controllers.',
    status: 'todo',
    priority: 'high',
    tags: ['backend', 'security', 'zod'],
  },
  {
    title: 'Construct Zero-CLS SkeletonLoaders matching card dimensions',
    description: 'Prevent layout shift during asynchronous data fetching by matching exact CSS dimensions.',
    status: 'todo',
    priority: 'high',
    tags: ['frontend', 'ux', 'performance'],
  },
  {
    title: 'Add rate limiting to workspace invite endpoint',
    description: 'Prevent spam invites with an IP and user-based token bucket rate limiter (10 req/min).',
    status: 'todo',
    priority: 'medium',
    tags: ['backend', 'security'],
  },
  {
    title: 'Implement dark/light theme persistence in localStorage',
    description: 'Synchronize theme selection across tabs and remember user preference on reload.',
    status: 'todo',
    priority: 'low',
    tags: ['frontend', 'ui'],
  },
  {
    title: 'Add keyboard navigation shortcuts for Kanban columns',
    description: 'Enable arrow keys to move focus between task cards and columns for power users.',
    status: 'todo',
    priority: 'medium',
    tags: ['accessibility', 'frontend'],
  },
  {
    title: 'Build member management modal with role selector',
    description: 'Allow workspace admins to invite members via email with roles: owner, admin, or member.',
    status: 'todo',
    priority: 'high',
    tags: ['frontend', 'auth', 'workspaces'],
  },
  {
    title: 'Configure automated DB health probes on /api/v1/health',
    description: 'Report connection status, Mongoose pool utilization, and process uptime.',
    status: 'todo',
    priority: 'medium',
    tags: ['backend', 'monitoring'],
  },

  // IN-PROGRESS
  {
    title: 'Refactor Task Controller into strict Controller-Service pattern',
    description: 'Decouple HTTP request handling from Mongoose query logic to adhere to clean architecture.',
    status: 'in-progress',
    priority: 'urgent',
    tags: ['backend', 'architecture', 'refactor'],
  },
  {
    title: 'Build responsive 4-stage interactive Kanban board',
    description: 'Implement drag/drop and instant status toggling with optimistic UI updates.',
    status: 'in-progress',
    priority: 'urgent',
    tags: ['frontend', 'kanban', 'react'],
  },
  {
    title: 'Implement threaded comment system with author populate',
    description: 'Enable team members to comment on tasks without bloating parent task document size.',
    status: 'in-progress',
    priority: 'high',
    tags: ['backend', 'comments', 'database'],
  },
  {
    title: 'Integrate live search filter with instant debouncing',
    description: 'Filter tasks in real-time as user types in the header search input bar.',
    status: 'in-progress',
    priority: 'medium',
    tags: ['frontend', 'search'],
  },
  {
    title: 'Configure CORS headers for Vercel production deployment',
    description: 'Whitelist production frontend domain and localhost for seamless REST communication.',
    status: 'in-progress',
    priority: 'high',
    tags: ['backend', 'devops', 'security'],
  },
  {
    title: 'Design high-contrast visual priority badges',
    description: 'Craft sleek badges for Urgent, High, Medium, and Low priorities with glowing accents.',
    status: 'in-progress',
    priority: 'medium',
    tags: ['frontend', 'design'],
  },
  {
    title: 'Sanitize user inputs to prevent stored XSS attacks',
    description: 'Escape HTML entities in task titles and comments before persistence.',
    status: 'in-progress',
    priority: 'high',
    tags: ['security', 'backend'],
  },

  // DONE
  {
    title: 'Initialize multi-tier monorepo structure',
    description: 'Set up isolated backend and frontend workspaces with shared scripts.',
    status: 'done',
    priority: 'high',
    tags: ['infrastructure', 'setup'],
  },
  {
    title: 'Establish Mongoose schemas for User, Workspace, Task, and Comment',
    description: 'Formulate embedding vs referencing schema rules per architectural specifications.',
    status: 'done',
    priority: 'urgent',
    tags: ['database', 'mongoose'],
  },
  {
    title: 'Implement centralized Express error handling pipeline',
    description: 'Map CastError, DuplicateKey (11000), ZodError, and AppError to standard JSON envelopes.',
    status: 'done',
    priority: 'urgent',
    tags: ['backend', 'error-handling'],
  },
  {
    title: 'Configure Vite development server with proxy and vanilla CSS tokens',
    description: 'Setup rich design tokens, dark mode palette, and CSS variables.',
    status: 'done',
    priority: 'medium',
    tags: ['frontend', 'css'],
  },
  {
    title: 'Set up MongoDB Atlas M0 Free Tier cluster',
    description: 'Provision cloud database, network whitelist 0.0.0.0/0, and credentials.',
    status: 'done',
    priority: 'high',
    tags: ['database', 'cloud'],
  },
  {
    title: 'Deploy backend serverless handler on Vercel',
    description: 'Configure vercel.json with @vercel/node builder and test /api/v1/health live.',
    status: 'done',
    priority: 'urgent',
    tags: ['devops', 'deployment'],
  },
  {
    title: 'Establish custom React hooks: useWorkspace, useTasks, useCreateTask',
    description: 'Segregate server state from client UI state with cache invalidation on mutations.',
    status: 'done',
    priority: 'high',
    tags: ['frontend', 'state-management'],
  },
];

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Workspace.deleteMany({}),
      Task.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log('[Seed] Seeding users...');
    const createdUsers = await User.insertMany(mockUsers);
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    console.log('[Seed] Seeding workspaces...');
    const acmeWorkspace = await Workspace.create({
      name: 'Acme Engineering',
      slug: 'acme-eng',
      description: 'Core engineering organization for Acme platform and distributed infrastructure.',
      members: [
        {
          userId: userMap['lead@acme.com']._id,
          email: userMap['lead@acme.com'].email,
          name: userMap['lead@acme.com'].name,
          role: 'owner',
          joinedAt: new Date(Date.now() - 30 * 86400000),
        },
        {
          userId: userMap['alex.dev@acme.com']._id,
          email: userMap['alex.dev@acme.com'].email,
          name: userMap['alex.dev@acme.com'].name,
          role: 'admin',
          joinedAt: new Date(Date.now() - 25 * 86400000),
        },
        {
          userId: userMap['maya.qa@acme.com']._id,
          email: userMap['maya.qa@acme.com'].email,
          name: userMap['maya.qa@acme.com'].name,
          role: 'member',
          joinedAt: new Date(Date.now() - 20 * 86400000),
        },
        {
          userId: userMap['marcus@acme.com']._id,
          email: userMap['marcus@acme.com'].email,
          name: userMap['marcus@acme.com'].name,
          role: 'member',
          joinedAt: new Date(Date.now() - 15 * 86400000),
        },
        {
          userId: userMap['elena@acme.com']._id,
          email: userMap['elena@acme.com'].email,
          name: userMap['elena@acme.com'].name,
          role: 'member',
          joinedAt: new Date(Date.now() - 10 * 86400000),
        },
      ],
    });

    const devpulseWorkspace = await Workspace.create({
      name: 'DevPulse Core Team',
      slug: 'devpulse-core',
      description: 'Main product team workspace for DevPulse Kanban and multi-tenant orchestration.',
      members: [
        {
          userId: userMap['lead@acme.com']._id,
          email: userMap['lead@acme.com'].email,
          name: userMap['lead@acme.com'].name,
          role: 'owner',
          joinedAt: new Date(),
        },
        {
          userId: userMap['alex.dev@acme.com']._id,
          email: userMap['alex.dev@acme.com'].email,
          name: userMap['alex.dev@acme.com'].name,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
    });

    console.log('[Seed] Seeding 30+ mock tasks for Acme Engineering...');
    const userKeys = Object.keys(userMap);
    const tasksToInsert = mockTasksData.map((task, idx) => {
      const assignedUser = userMap[userKeys[idx % userKeys.length]];
      return {
        ...task,
        workspaceId: acmeWorkspace._id,
        assigneeId: assignedUser._id,
        createdAt: new Date(Date.now() - (30 - idx) * 3600000),
        updatedAt: new Date(Date.now() - (30 - idx) * 1800000),
      };
    });

    const createdTasks = await Task.insertMany(tasksToInsert);
    console.log(`[Seed] Successfully seeded ${createdTasks.length} tasks!`);

    console.log('[Seed] Seeding threaded comments for active tasks...');
    const commentsToInsert = [];
    const commentTexts = [
      'Started profiling the query execution plan with explain("executionStats").',
      'The compound index reduced totalDocsExamined from 40,000 to 20!',
      'PR opened with unit tests covering status edge cases.',
      'Verified with Zero-CLS audit in Chrome Lighthouse, score is 100.',
      'Deployment verified on Vercel preview branch. All tests green.',
    ];

    createdTasks.slice(0, 10).forEach((t, i) => {
      const commenter = userMap[userKeys[(i + 1) % userKeys.length]];
      commentsToInsert.push({
        taskId: t._id,
        authorId: commenter._id,
        content: commentTexts[i % commentTexts.length],
        createdAt: new Date(Date.now() - (10 - i) * 600000),
      });
      if (i % 2 === 0) {
        const commenter2 = userMap[userKeys[(i + 2) % userKeys.length]];
        commentsToInsert.push({
          taskId: t._id,
          authorId: commenter2._id,
          content: 'Agreed, this meets all acceptance criteria. Ready to merge.',
          createdAt: new Date(Date.now() - (10 - i) * 300000),
        });
      }
    });

    await Comment.insertMany(commentsToInsert);
    console.log(`[Seed] Successfully seeded ${commentsToInsert.length} threaded comments!`);

    // Ensure compound indexes are built
    await Task.syncIndexes();
    await Workspace.syncIndexes();
    await User.syncIndexes();
    await Comment.syncIndexes();

    console.log('[Seed] Database indexes synchronized successfully.');
    console.log('----------------------------------------------------');
    console.log(`Default Workspace Slug: ${acmeWorkspace.slug}`);
    console.log(`Default Workspace ID:   ${acmeWorkspace._id}`);
    console.log(`Total Tasks Seeded:     ${createdTasks.length}`);
    console.log(`Total Users Seeded:     ${createdUsers.length}`);
    console.log('----------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
