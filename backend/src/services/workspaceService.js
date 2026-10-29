import mongoose from 'mongoose';
import { Workspace } from '../models/Workspace.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { mockStore } from './mockStore.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

export const workspaceService = {
  /**
   * Create a new workspace with embedded owner member
   */
  async createWorkspace({ name, slug, ownerEmail, ownerName, description }) {
    if (!isDBConnected()) {
      const existing = await mockStore.getWorkspaceBySlug(slug);
      if (existing) {
        throw new AppError(`A workspace with slug '${slug}' already exists.`, 409, 'DUPLICATE_RESOURCE');
      }
      return await mockStore.createWorkspace({ name, slug, ownerEmail, ownerName, description });
    }

    const existing = await Workspace.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      throw new AppError(`A workspace with slug '${slug}' already exists.`, 409, 'DUPLICATE_RESOURCE');
    }

    // Find or create the owner user
    let owner = await User.findOne({ email: ownerEmail.toLowerCase() });
    if (!owner) {
      owner = await User.create({
        name: ownerName,
        email: ownerEmail.toLowerCase(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ownerName)}`,
      });
    }

    const workspace = await Workspace.create({
      name,
      slug: slug.toLowerCase(),
      description: description || '',
      members: [
        {
          userId: owner._id,
          email: owner.email,
          name: owner.name,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
    });

    return workspace;
  },

  /**
   * Get workspace by slug
   */
  async getWorkspaceBySlug(slug) {
    if (!isDBConnected()) {
      const ws = await mockStore.getWorkspaceBySlug(slug);
      if (!ws) {
        throw new AppError(`Workspace with slug '${slug}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
      }
      return ws;
    }

    const workspace = await Workspace.findOne({ slug: slug.toLowerCase() });
    if (!workspace) {
      throw new AppError(`Workspace with slug '${slug}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
    }
    return workspace;
  },

  /**
   * Get workspace by ID
   */
  async getWorkspaceById(id) {
    if (!isDBConnected()) {
      const ws = await mockStore.getWorkspaceById(id);
      if (!ws) {
        throw new AppError(`Workspace with ID '${id}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
      }
      return ws;
    }

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      throw new AppError(`Workspace with ID '${id}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
    }
    return workspace;
  },

  /**
   * List all workspaces (for workspace switcher)
   */
  async getAllWorkspaces() {
    if (!isDBConnected()) {
      return await mockStore.getAllWorkspaces();
    }
    return await Workspace.find().sort({ createdAt: -1 });
  },

  /**
   * Add a member to a workspace by slug
   */
  async addMember(slug, { email, name, role = 'member' }) {
    if (!isDBConnected()) {
      const ws = await mockStore.getWorkspaceBySlug(slug);
      if (!ws) {
        throw new AppError(`Workspace with slug '${slug}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
      }
      return await mockStore.addMember(slug, { email, name, role });
    }

    const workspace = await Workspace.findOne({ slug: slug.toLowerCase() });
    if (!workspace) {
      throw new AppError(`Workspace with slug '${slug}' not found.`, 404, 'WORKSPACE_NOT_FOUND');
    }

    const normalizedEmail = email.toLowerCase();
    const alreadyMember = workspace.members.some(
      (m) => m.email.toLowerCase() === normalizedEmail
    );

    if (alreadyMember) {
      throw new AppError(`User '${email}' is already a member of this workspace.`, 409, 'DUPLICATE_RESOURCE');
    }

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      });
    }

    workspace.members.push({
      userId: user._id,
      email: user.email,
      name: user.name,
      role,
      joinedAt: new Date(),
    });

    await workspace.save();
    return workspace;
  },
};
