import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { TeamMember } from '../models/TeamMember.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  isOffline,
  getOfflineTeamMembers,
  getOfflineTeamMemberById,
  createOfflineTeamMember,
  updateOfflineTeamMember,
  deleteOfflineTeamMember,
} from '../utils/offlineFallback.js';

/**
 * Helper to safely delete local uploaded image if it was stored in /uploads/
 */
const cleanupLocalImage = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return;
  if (imagePath.startsWith('/uploads/')) {
    const filename = imagePath.replace('/uploads/', '');
    const fullPath = path.join(process.cwd(), 'backend', 'uploads', filename);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.warn('Could not remove file:', fullPath, err.message);
      }
    }
  }
};

/**
 * PUBLIC / ADMIN: GET ALL TEAM MEMBERS
 * Route: GET /api/v1/team-members
 */
export const getTeamMembers = asyncHandler(async (req, res) => {
  const { search, activeOnly } = req.query;

  if (isOffline()) {
    let members = getOfflineTeamMembers({ search });
    if (activeOnly === 'true' || activeOnly === true) {
      members = members.filter((m) => m.isActive !== false);
    }
    return res.status(200).json(
      ApiResponse.success(members, 'Team members retrieved successfully (offline mode).')
    );
  }

  const query = {};
  if (activeOnly === 'true' || activeOnly === true) {
    query.isActive = true;
  }
  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ name: regex }, { role: regex }, { bio: regex }, { company: regex }];
  }

  const members = await TeamMember.find(query)
    .sort({ order: 1, createdAt: -1 })
    .lean({ virtuals: true });

  const formatted = members.map((m) => {
    const id = m._id ? m._id.toString() : m.id;
    return {
      ...m,
      id,
      author: m.name,
      designation: m.role,
      quote: m.bio,
      avatar: m.image || '',
    };
  });

  return res.status(200).json(
    ApiResponse.success(formatted, 'Team members retrieved successfully.')
  );
});

/**
 * PUBLIC / ADMIN: GET SINGLE TEAM MEMBER BY ID
 * Route: GET /api/v1/team-members/:id
 */
export const getTeamMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isOffline()) {
    const member = getOfflineTeamMemberById(id);
    if (!member) {
      throw ApiError.notFound('Team member not found.');
    }
    return res.status(200).json(
      ApiResponse.success(member, 'Team member retrieved successfully (offline mode).')
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Team Member ID format.');
  }

  const member = await TeamMember.findById(id);
  if (!member) {
    throw ApiError.notFound('Team member not found.');
  }

  return res.status(200).json(
    ApiResponse.success(member, 'Team member retrieved successfully.')
  );
});

/**
 * PROTECTED (ADMIN): CREATE TEAM MEMBER
 * Route: POST /api/v1/team-members
 */
export const createTeamMember = asyncHandler(async (req, res) => {
  const { name, fullName, role, designation, bio, description, quote, company, order, isActive, qualification, bgColor } = req.body;

  const memberName = (name || fullName || '').trim();
  const memberRole = (role || designation || '').trim();
  const memberBio = (bio || description || quote || '').trim();
  const memberCompany = (company || 'Bucks n Bricks').trim();
  const memberQualification = (qualification || '').trim();
  const memberBgColor = (bgColor || '').trim();
  const memberOrder = order !== undefined ? Number(order) : 0;
  const memberIsActive = isActive !== undefined ? (isActive === 'true' || isActive === true) : true;

  if (!memberName) {
    throw ApiError.badRequest('Full Name is required.');
  }
  if (!memberRole) {
    throw ApiError.badRequest('Job title / designation is required.');
  }
  if (!memberBio) {
    throw ApiError.badRequest('Short description or bio is required.');
  }

  // Handle image: uploaded file takes priority, then body.image / body.picture / body.avatar
  let image = '';
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  } else if (req.body.image) {
    image = req.body.image.trim();
  } else if (req.body.picture) {
    image = req.body.picture.trim();
  } else if (req.body.avatar) {
    image = req.body.avatar.trim();
  }

  if (isOffline()) {
    const created = createOfflineTeamMember({
      name: memberName,
      role: memberRole,
      bio: memberBio,
      image,
      company: memberCompany,
      order: memberOrder,
      isActive: memberIsActive,
      createdBy: req.admin ? req.admin.id : null,
    });

    return res.status(201).json(
      ApiResponse.created(created, 'Team member added successfully (offline mode).')
    );
  }

  const newMember = await TeamMember.create({
    name: memberName,
    role: memberRole,
    bio: memberBio,
    image,
    company: memberCompany,
    qualification: memberQualification,
    bgColor: memberBgColor,
    order: memberOrder,
    isActive: memberIsActive,
    createdBy: req.admin ? req.admin._id : null,
  });

  return res.status(201).json(
    ApiResponse.created(newMember, 'Team member added successfully.')
  );
});

/**
 * PROTECTED (ADMIN): UPDATE TEAM MEMBER
 * Route: PATCH /api/v1/team-members/:id or PUT /api/v1/team-members/:id
 */
export const updateTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, fullName, role, designation, bio, description, quote, company, order, isActive, qualification, bgColor } = req.body;

  const updates = {};
  if (name || fullName) updates.name = (name || fullName).trim();
  if (role || designation) updates.role = (role || designation).trim();
  if (bio || description || quote) updates.bio = (bio || description || quote).trim();
  if (company !== undefined) updates.company = company.trim();
  if (qualification !== undefined) updates.qualification = qualification.trim();
  if (bgColor !== undefined) updates.bgColor = bgColor.trim();
  if (order !== undefined) updates.order = Number(order);
  if (isActive !== undefined) updates.isActive = isActive === 'true' || isActive === true;

  if (req.file) {
    updates.image = `/uploads/${req.file.filename}`;
  } else if (req.body.image !== undefined) {
    updates.image = req.body.image.trim();
  } else if (req.body.picture !== undefined) {
    updates.image = req.body.picture.trim();
  } else if (req.body.avatar !== undefined) {
    updates.image = req.body.avatar.trim();
  }

  if (isOffline()) {
    const existing = getOfflineTeamMemberById(id);
    if (!existing) {
      throw ApiError.notFound('Team member not found.');
    }

    // If new image uploaded and old image was local, cleanup
    if (req.file && existing.image && existing.image !== updates.image) {
      cleanupLocalImage(existing.image);
    }

    const updated = updateOfflineTeamMember(id, updates);
    return res.status(200).json(
      ApiResponse.success(updated, 'Team member updated successfully (offline mode).')
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Team Member ID format.');
  }

  const existing = await TeamMember.findById(id);
  if (!existing) {
    throw ApiError.notFound('Team member not found.');
  }

  if (req.file && existing.image && existing.image !== updates.image) {
    cleanupLocalImage(existing.image);
  }

  Object.assign(existing, updates);
  await existing.save();

  return res.status(200).json(
    ApiResponse.success(existing, 'Team member updated successfully.')
  );
});

/**
 * PROTECTED (ADMIN): DELETE TEAM MEMBER
 * Route: DELETE /api/v1/team-members/:id
 */
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isOffline()) {
    const existing = getOfflineTeamMemberById(id);
    if (!existing) {
      throw ApiError.notFound('Team member not found.');
    }

    if (existing.image) {
      cleanupLocalImage(existing.image);
    }

    deleteOfflineTeamMember(id);
    return res.status(200).json(
      ApiResponse.success({ id }, 'Team member deleted successfully (offline mode).')
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest('Invalid Team Member ID format.');
  }

  const member = await TeamMember.findById(id);
  if (!member) {
    throw ApiError.notFound('Team member not found.');
  }

  if (member.image) {
    cleanupLocalImage(member.image);
  }

  await TeamMember.findByIdAndDelete(id);

  return res.status(200).json(
    ApiResponse.success({ id }, 'Team member deleted successfully.')
  );
});
