import { Router } from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamMemberController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();

/**
 * PUBLIC ROUTES
 */
// GET /api/v1/team-members - List all team members
router.get('/', getTeamMembers);

// GET /api/v1/team-members/:id - Get single team member
router.get('/:id', getTeamMemberById);

/**
 * PROTECTED ADMIN ROUTES (Requires Admin JWT Token)
 */
// POST /api/v1/team-members - Create a new team member (supports image file upload)
router.post('/', protectAdmin, uploadImage.single('image'), createTeamMember);

// PATCH /api/v1/team-members/:id - Update existing team member
router.patch('/:id', protectAdmin, uploadImage.single('image'), updateTeamMember);

// PUT /api/v1/team-members/:id - Update existing team member (compatibility)
router.put('/:id', protectAdmin, uploadImage.single('image'), updateTeamMember);

// DELETE /api/v1/team-members/:id - Delete team member
router.delete('/:id', protectAdmin, deleteTeamMember);

export default router;
