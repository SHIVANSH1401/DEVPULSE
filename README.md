# DevPulse — Scalable Multi-Tenant Task & Workspace Management Engine

[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB Mongoose](https://img.shields.io/badge/mongoose-8.9.5-green.svg)](https://mongoosejs.com/)
[![Zod Validation](https://img.shields.io/badge/zod-3.24.1-purple.svg)](https://zod.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

DevPulse is a high-performance, multi-tenant workspace and task orchestration engine designed for engineering and product teams. It mirrors the core capabilities of enterprise project management platforms like Plane, Linear, and Jira.

The system allows organizations to create isolated workspaces, manage member access with role hierarchies, organize tasks across interactive Kanban stages with native drag-and-drop, filter in real-time by priority and search query, and track discussions through threaded task comments.

---

## 1. System Architecture Blueprint

DevPulse is architected as a decoupled, multi-tier system strictly separating presentation, business logic, and persistent storage:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DEVPULSE THREE-TIER MERN ARCHITECTURE                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   CLIENT TIER (React 18 + Vite)                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ UI Components (Kanban / Cards / Modals / Theme Engine)         │   │
│   │                              │                                 │   │
│   │                              ▼                                 │   │
│   │ Custom Data Hooks (useWorkspace, useTasks, useCreateTask)      │   │
│   │                              │                                 │   │
│   │                              ▼                                 │   │
│   │ API Client Service Layer (Axios Interceptors & Error Envelope) │   │
│   └──────────────────────────────┬─────────────────────────────────┘   │
│                                  │ HTTP / JSON REST                    │
│                                  ▼                                     │
│   APPLICATION TIER (Node.js & Express)                                 │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Route Layer & Middlewares (Zod Validator, Rate Limiter)        │   │
│   │                              │                                 │   │
│   │                              ▼                                 │   │
│   │ Controllers (Req Extraction, Status Code, Envelope Formatting) │   │
│   │                              │                                 │   │
│   │                              ▼                                 │   │
│   │ Services (Pure Business Logic, Domain Rules, Orchestration)    │   │
│   │                              │                                 │   │
│   │                              ▼                                 │   │
│   │ Models (Mongoose Schemas, Index Definitions, Query Logic)      │   │
│   └──────────────────────────────┬─────────────────────────────────┘   │
│                                  │ Mongoose BSON Protocol              │
│                                  ▼                                     │
│   DATA TIER (MongoDB Server / MongoDB Atlas)                           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Collections: workspaces | users | tasks | comments             │   │
│   │ Compound Index: { workspaceId: 1, status: 1, createdAt: -1 }   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Directory Structure

```text
devpulse/
├── backend/
│   ├── seeds/
│   │   └── seedData.js               # 30+ mock tasks & test workspace seeder
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Mongoose connection & pool config
│   │   ├── controllers/
│   │   │   ├── workspaceController.js# Workspace HTTP req/res handling
│   │   │   └── taskController.js     # Task HTTP req/res handling
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js       # Centralized Express error handler
│   │   │   ├── rateLimiter.js        # Sliding-window rate limiter
│   │   │   └── validateRequest.js    # Zod schema validation middleware
│   │   ├── models/
│   │   │   ├── Comment.js            # Referenced task comment schema
│   │   │   ├── Task.js               # Task schema + compound index
│   │   │   ├── User.js               # User identity schema
│   │   │   └── Workspace.js          # Workspace schema + embedded members
│   │   ├── routes/
│   │   │   ├── taskRoutes.js         # /api/v1/tasks endpoints
│   │   │   └── workspaceRoutes.js    # /api/v1/workspaces endpoints
│   │   ├── services/
│   │   │   ├── taskService.js        # Task business logic, filters, pagination
│   │   │   └── workspaceService.js   # Workspace business logic & queries
│   │   ├── utils/
│   │   │   ├── AppError.js           # Custom operational error class
│   │   │   └── catchAsync.js         # Async controller wrapper utility
│   │   ├── validators/
│   │   │   └── schemas.js            # Zod validation contracts
│   │   └── app.js                    # Express app configuration & middlewares
│   ├── tests/
│   │   └── api.test.js               # Node native test runner test suite
│   ├── package.json
│   ├── server.js                     # HTTP server startup & graceful shutdown
│   ├── vercel.json                   # Serverless deployment configuration
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ErrorBoundary.jsx # Client crash resilience
│   │   │   │   └── SkeletonLoader.jsx# Zero-CLS loading cards
│   │   │   ├── kanban/
│   │   │   │   ├── TaskBoard.jsx     # 4-column Kanban container
│   │   │   │   ├── TaskCard.jsx      # Individual card, drag-and-drop & status toggle
│   │   │   │   └── TaskColumn.jsx    # Column drop targets (Backlog, Todo, InProg, Done)
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx     # Responsive master shell
│   │   │   │   ├── Header.jsx        # Real-time search, filter, and theme switch
│   │   │   │   └── Sidebar.jsx       # Workspace switcher & member roster
│   │   │   └── modals/
│   │   │       ├── CreateWorkspaceModal.jsx # Controlled workspace creation modal
│   │   │       ├── MemberModal.jsx   # Invite collaborator modal
│   │   │       └── TaskModal.jsx     # Controlled create/edit modal + comments
│   │   ├── hooks/
│   │   │   ├── useCreateTask.js      # Task creation mutation hook
│   │   │   ├── useTasks.js           # Task state, optimistic status updates
│   │   │   └── useWorkspace.js       # Workspace resolution & member sync
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios instance with interceptors
│   │   ├── App.jsx                   # Root view container
│   │   ├── index.css                 # Vanilla CSS design tokens & themes
│   │   └── main.jsx                  # React DOM entry point
│   ├── package.json
│   ├── vercel.json                   # SPA routing rewrites
│   ├── vite.config.js
│   └── .env.example
├── docs/
│   ├── ARCHITECTURE.md               # Technical Architecture Blueprint
│   └── PRD.md                        # Product Requirements Document
├── package.json                      # Monorepo root scripts
└── README.md
```

---

## 3. Data Architecture & Compound Indexing Strategy

### Embedding vs. Referencing Rationale
1. **Workspace Members (Embedded):**
   * *Decision:* Embed `members: [{ userId, role, joinedAt }]` inside `Workspace`.
   * *Rationale:* Workspace teams are bounded in size (< 100 members). Embedding eliminates an expensive `$lookup` / join query on every workspace page load.
2. **Tasks (Referenced):**
   * *Decision:* Store `Task` documents in an independent `tasks` collection referencing `workspaceId`.
   * *Rationale:* Tasks in an active organization grow unbounded (thousands of tasks). Storing tasks inside a workspace document would quickly exceed MongoDB’s **16MB BSON document limit** and destroy write concurrency.
3. **Comments (Referenced):**
   * *Decision:* Store `Comment` documents in an independent `comments` collection referencing `taskId`.
   * *Rationale:* Comments grow unbounded. Embedding them inside tasks degrades task list query performance.

### Compound Index Order Rationale
```javascript
// backend/src/models/Task.js
TaskSchema.index(
  { workspaceId: 1, status: 1, createdAt: -1 },
  { name: 'idx_workspace_status_created' }
);
```
Following the **ESR (Equality, Sort, Range)** indexing principle:
1. `workspaceId (Equality)`: Narrows the scan from millions of documents to the target tenant.
2. `status (Equality / In-list)`: Partitions tasks into the 4 Kanban columns (`backlog`, `todo`, `in-progress`, `done`).
3. `createdAt (Range / Sort)`: Satisfies default sort order descending (`-1`) without requiring an in-memory memory-sort operation (index-supported sort), ensuring query resolution in **< 50ms**.

---

## 4. REST API Contract & Standard Envelopes

All endpoints are prefixed with `/api/v1`.

### Success Response Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Response Envelope (HTTP 400 / 404 / 409 / 429 / 500)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title must be at least 3 characters long",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters long"
      }
    ]
  }
}
```

### Endpoints Matrix
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health probe & DB status | `200 OK` |
| `GET` | `/api/v1/workspaces` | List all workspaces | `200 OK` |
| `POST` | `/api/v1/workspaces` | Create new workspace (Rate limited: 20/min) | `201 Created` |
| `GET` | `/api/v1/workspaces/:slug` | Get workspace details & members | `200 OK` |
| `POST` | `/api/v1/workspaces/:slug/members` | Invite member (Rate limited: 10/min) | `200 OK` |
| `GET` | `/api/v1/workspaces/:workspaceId/tasks` | List tasks (filtering & pagination) | `200 OK` |
| `POST` | `/api/v1/workspaces/:workspaceId/tasks` | Create task under workspace | `201 Created` |
| `GET` | `/api/v1/tasks/:id` | Get single task details | `200 OK` |
| `PATCH` | `/api/v1/tasks/:id` | Update task fields / status | `200 OK` |
| `DELETE` | `/api/v1/tasks/:id` | Delete task & cascade delete comments | `200 OK` |
| `GET` | `/api/v1/tasks/:taskId/comments` | List comments for a task | `200 OK` |
| `POST` | `/api/v1/tasks/:taskId/comments` | Post comment to a task | `201 Created` |

---

## 5. Getting Started & Local Setup

### Prerequisites
- Node.js >= 20.x
- npm >= 9.x
- MongoDB Server running locally on `localhost:27017` or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Installation
Clone the repository and install dependencies at the monorepo root:
```bash
git clone https://github.com/SHIVANSH1401/devpulse.git
cd devpulse
npm install
```

### 2. Configure Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devpulse?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed Mock Data (30+ Tasks & Default Workspace)
Run the automated seed script to populate Acme Engineering and 30+ categorized tasks:
```bash
npm run seed
```

### 4. Run Development Servers
Start backend and frontend concurrently:
```bash
# Terminal 1: Backend API (port 5000)
npm run dev:backend

# Terminal 2: Frontend Client (port 5173)
npm run dev:frontend
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Automated Testing

DevPulse utilizes Node.js's native test runner (`node:test` and `node:assert`) to validate contracts, Zod schemas, error formatting, and rate limiting:

```bash
npm test
```

Test coverage includes:
- `GET /api/v1/health` status and metadata structure
- `AC-1`: Zod validation rejection for titles `< 3` characters
- Compound index field schema verification
- Rate limiter middleware threshold enforcement (429 response)
- Centralized `AppError` operational error formatting

---

## 7. Cloud Production Deployment: Vercel & MongoDB Atlas

### 1. MongoDB Atlas Setup
1. Create a free shared cluster (`M0 Sandbox`) on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write access.
3. In **Network Access**, whitelist `0.0.0.0/0` (Allow Access from Anywhere) for Vercel serverless functions.
4. Copy your SRV connection URI.

### 2. Deploy Backend to Vercel
```bash
cd backend
npx vercel --prod
```
Set environment variables on Vercel:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `CLIENT_URL`: Your deployed frontend Vercel URL
- `NODE_ENV`: `production`

### 3. Deploy Frontend to Vercel
Update `frontend/.env.production` with your deployed backend URL:
```env
VITE_API_URL=https://your-backend.vercel.app/api/v1
```
Deploy frontend:
```bash
cd frontend
npx vercel --prod
```

---

## 8. Acceptance Criteria Verification Matrix

| Criterion | Requirement | Implementation & Validation | Status |
| :--- | :--- | :--- | :---: |
| **AC-1** | Create task with `< 3` char title returns 400 error envelope | Zod `createTaskSchema` + `errorHandler.js` returns HTTP 400 and `VALIDATION_ERROR` details. | PASS |
| **AC-2** | Fetching tasks returns sorted tasks with pagination | `taskService.getTasks` supports pagination (`page`, `limit`, `total`, `totalPages`) and sort `-1`. | PASS |
| **AC-3** | Kanban status toggling reflects immediately in UI & DB | Optimistic UI update in `useTasks.js` with HTML5 Drag-and-Drop and dropdown toggle. | PASS |
| **AC-4** | Zero Cumulative Layout Shift (CLS) | `SkeletonLoader.jsx` matches exact card dimensions (138px height) during async fetches. | PASS |
| **AC-5** | Uncaught exceptions do not crash Express | `catchAsync.js` + centralized `errorHandler.js` operational pipeline. | PASS |
| **AC-6** | Cloud deployment on Vercel + MongoDB Atlas | Serverless configuration in `backend/vercel.json` and static rewrites in `frontend/vercel.json`. | PASS |
| **AC-7** | Live cross-origin communication with zero CORS issues | Flexible CORS origin callback handling Vercel preview domains and localhost. | PASS |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
