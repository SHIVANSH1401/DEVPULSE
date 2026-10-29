import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../src/app.js';
import { AppError } from '../src/utils/AppError.js';
import { createTaskSchema, createWorkspaceSchema } from '../src/validators/schemas.js';
import { rateLimiter } from '../src/middlewares/rateLimiter.js';

describe('DevPulse API & Architecture Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    // Start an ephemeral HTTP server on a random available port
    await new Promise((resolve) => {
      server = http.createServer(app).listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  describe('Health Check Endpoint (PRD Section 5.2)', () => {
    test('GET /api/v1/health returns HTTP 200 with standard envelope', async () => {
      const res = await fetch(`${baseUrl}/api/v1/health`);
      assert.strictEqual(res.status, 200);

      const json = await res.json();
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.status, 'UP');
      assert.ok(json.timestamp);
      assert.ok('database' in json);
      assert.ok('uptime' in json);
    });

    test('GET / returns 200 welcome envelope with metadata', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.strictEqual(res.status, 200);

      const json = await res.json();
      assert.strictEqual(json.name, 'DevPulse API');
      assert.strictEqual(json.version, '1.0.0');
    });
  });

  describe('AC-1: Zod Request Validation & Error Pipeline', () => {
    test('createTaskSchema rejects title shorter than 3 characters', async () => {
      const invalidPayload = {
        body: {
          title: 'AB', // < 3 characters
          status: 'todo',
          priority: 'high',
        },
      };

      await assert.rejects(
        async () => {
          await createTaskSchema.parseAsync(invalidPayload);
        },
        (err) => {
          assert.strictEqual(err.name, 'ZodError');
          const issue = err.errors.find((e) => e.path.includes('title'));
          assert.ok(issue);
          assert.match(issue.message, /at least 3 character/i);
          return true;
        }
      );
    });

    test('createTaskSchema accepts valid task data with defaults', async () => {
      const validPayload = {
        body: {
          title: 'Implement MongoDB compound indexing',
          description: 'Indexes on workspaceId, status, and createdAt',
        },
      };

      const parsed = await createTaskSchema.parseAsync(validPayload);
      assert.strictEqual(parsed.body.title, 'Implement MongoDB compound indexing');
      assert.strictEqual(parsed.body.status, 'todo'); // default
      assert.strictEqual(parsed.body.priority, 'medium'); // default
      assert.deepStrictEqual(parsed.body.tags, []); // default
    });

    test('createWorkspaceSchema rejects invalid slug with special characters', async () => {
      const invalidWorkspace = {
        body: {
          name: 'Acme Mobile',
          slug: 'acme_mobile!@#', // invalid regex
          ownerName: 'Sarah Lead',
          ownerEmail: 'lead@acme.com',
        },
      };

      await assert.rejects(
        async () => {
          await createWorkspaceSchema.parseAsync(invalidWorkspace);
        },
        (err) => {
          assert.strictEqual(err.name, 'ZodError');
          const issue = err.errors.find((e) => e.path.includes('slug'));
          assert.ok(issue);
          return true;
        }
      );
    });

    test('POST /api/v1/workspaces with invalid payload returns 400 with VALIDATION_ERROR envelope', async () => {
      const res = await fetch(`${baseUrl}/api/v1/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          slug: '',
        }),
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.data, null);
      assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
      assert.ok(Array.isArray(json.error.details));
      assert.ok(json.error.details.length > 0);
    });

    test('POST /api/v1/workspaces/671e3b5e4f1a2b3c4d5e6f7a/tasks with < 3 char title returns 400', async () => {
      const res = await fetch(`${baseUrl}/api/v1/workspaces/671e3b5e4f1a2b3c4d5e6f7a/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Hi', // < 3 characters
          status: 'todo',
        }),
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error.code, 'VALIDATION_ERROR');
      assert.ok(json.error.details.some((d) => d.field === 'title'));
    });
  });

  describe('Centralized Error Handling & AppError', () => {
    test('Unknown route returns 404 with ROUTE_NOT_FOUND code', async () => {
      const res = await fetch(`${baseUrl}/api/v1/unknown-endpoint-route`);
      assert.strictEqual(res.status, 404);

      const json = await res.json();
      assert.strictEqual(json.success, false);
      assert.strictEqual(json.error.code, 'ROUTE_NOT_FOUND');
    });

    test('AppError creates formatted operational error', () => {
      const err = new AppError('Tenant not found', 404, 'TENANT_NOT_FOUND', [{ field: 'id', message: 'Not found' }]);
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.code, 'TENANT_NOT_FOUND');
      assert.strictEqual(err.isOperational, true);
      assert.strictEqual(err.details.length, 1);
    });
  });

  describe('Rate Limiter Middleware', () => {
    test('Rate limiter blocks requests exceeding max within window', () => {
      const limiter = rateLimiter({ max: 2, windowMs: 10000 });
      let statusPassed = 0;
      let caughtError = null;

      const mockReq = { headers: {}, socket: { remoteAddress: '192.168.1.100' } };
      const mockRes = { setHeader: () => {} };
      const mockNext = (err) => {
        if (err) {
          caughtError = err;
        } else {
          statusPassed++;
        }
      };

      // Temporarily unset test env to verify limiter logic
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        limiter(mockReq, mockRes, mockNext); // 1st
        limiter(mockReq, mockRes, mockNext); // 2nd
        limiter(mockReq, mockRes, mockNext); // 3rd -> exceeds max: 2

        assert.strictEqual(statusPassed, 2);
        assert.ok(caughtError);
        assert.strictEqual(caughtError.statusCode, 429);
        assert.strictEqual(caughtError.code, 'RATE_LIMIT_EXCEEDED');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
