import {
  getProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
  listUserProjects,
} from '../controllers/project.controllers.js';

import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').post(verifyJwt, createProject);

router.route('/').get(verifyJwt, listUserProjects);

router.route('/:projectId').get(verifyJwt, getProjectById);

router.route('/:projectId').put(verifyJwt, updateProject);

router.route('/:projectId').delete(verifyJwt, deleteProject);

router.route('/:projectId/members').get(verifyJwt,getProjectMembers);

router.route('/:projectId/members').post(verifyJwt,addMembersToProject);

router.route('/:projectId/members/:userId').put(verifyJwt,updateMemberRole);

router.route('/:projectId/members/:userId').delete(verifyJwt,deleteMember);

export default router;
