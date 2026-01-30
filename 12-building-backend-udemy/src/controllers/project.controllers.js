import { User } from '../models/user.models.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectmember.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import asyncHandler from '../utils/async-handler.js';
import { UserRolesEnum, AvailableUserRole } from '../constants/constants.js';
import mongoose from 'mongoose';

const getProject = asyncHandler(async (req, res) => {});

const getProjectById = asyncHandler(async (req, res) => {
  // i have to query project members collection to get the role of the user
  // if he is a member or admin  i should show him the project details by querying the project collection

  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized user');
  const projectId = req.params?.projectId;
  if (!projectId) throw new ApiError(400, 'Project-id is Required');

  const dbUser = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!dbUser)
    throw new ApiError(403, 'You are not the member of this project');

  const projectDetails = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdBy: 1,
      },
    },
  ]);

  if (!projectDetails.length) throw new ApiError(400, 'Project not found');

  res
    .status(200)
    .json(new ApiResponse(200, { projectDetails: projectDetails }));
});

const createProject = asyncHandler(async (req, res) => {
  const user = req.user;

  const { name, description } = req.body;

  if (!user) throw new ApiError(401, 'Unauthorized');
  if (!name || !description)
    throw new ApiError(400, 'Please provide all the information', []);

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user?._id),
  });

  if (!project)
    throw new ApiError(400, 'Something went wrong while creating project');
  console.log(project);
  const projectMember = await ProjectMember.create({
    user: new mongoose.Types.ObjectId(req.user?._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  res.status(201).json(new ApiResponse(201, 'Project created successfully'));
});

const listUserProjects = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized user');
  const projects = await ProjectMember.aggregate([
    {
      // gets all the project assigned to the user
      $match: {
        user: new mongoose.Types.ObjectId(user._id),
      },
      // i got all the project id's assigned to user
    },
    {
      $group: {
        _id: '$project',
      },
    },
    // now i have to query the project collection to get info of one by one project
    {
      // 3️⃣ Fetch project details
      $lookup: {
        from: 'projects', // collection name (IMPORTANT)
        localField: '_id', // project id from group
        foreignField: '_id', // _id in Project collection
        as: 'project',
      },
    },
    {
      // 4️⃣ Convert array → object
      $unwind: '$project',
    },
    {
      // 5️⃣ Optional: clean output
      $replaceRoot: {
        newRoot: '$project',
      },
    },
  ]);
  res.status(200).json(new ApiResponse(200, { projects: projects }));
});

const updateProject = asyncHandler(async (req, res) => {
  const user = req.user;
  const projectId = req.params?.projectId;
  const { name, description } = req.body;
  if (!name && !description) throw new ApiError(400, 'Nothing to update');

  if (!user) throw new ApiError(401, 'Unauthorized');
  if (!projectId) throw new ApiError(400, 'Project ID is required');

  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!membership) throw new ApiError(403, 'Forbidden: not a project member');
  if (membership.role !== 'admin')
    throw new ApiError(403, 'Only admins can update the project');

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'No project found');

  if (name) project.name = name;
  if (description) project.description = description;

  await project.save();

  res
    .status(200)
    .json(new ApiResponse(200, project, 'Project updated successfully'));
});

const deleteProject = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized user');

  const projectId = req.params?.projectId;

  if (!projectId) throw new ApiError(400, 'Project ID is required');
  // validate the user membership if he is a admin
  //check if the project exits

  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!membership) throw new ApiError(403, 'Invalid Request');

  if (membership.role !== 'admin')
    throw new ApiError(403, 'Only admins can delete the project');

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'Project not found');

  await Project.findByIdAndDelete(projectId);

  res
    .status(200)
    .json(new ApiResponse(200, [], 'Project deleted successfully'));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  // assuming that i will receive an user id and role in the request
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const projectId = req.params?.projectId;

  if (!projectId) throw new ApiError(400, 'Project ID is required');

  const { userId } = req.body;
  if (!userId) throw new ApiError(400, 'User ID must be specified');
  // chk whether user exists or not
  const validUser = await User.findById(userId);

  if (!validUser) throw new ApiError(400, 'User not found');

  //chk whether the user is associated with that project
  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!membership) throw new ApiError(400, 'Unauthorized access');

  // whether the project exists
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'Not found');

  // i need to check whether the current user has permission to add members
  if (membership.role !== 'admin') throw new ApiError(403, 'Invalid access');

  // chk if user is already member of that project
  const existingMember = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (existingMember)
    throw new ApiError(409, 'User is already a member of the project');

  //add member
  const role = req.body?.role ? req.body.role : UserRolesEnum.MEMBER;
  // if user role is invalid
  if (!AvailableUserRole.includes(role))
    throw new ApiError(400, 'Invalid User Role');

  const member = await ProjectMember.create({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
    role,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, member, 'Successfully added member to the project'),
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');
  const projectId = req.params?.projectId;
  if (!projectId) throw new ApiError(400, 'Project ID is required');

  // chk if user is associated to that project
  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!membership) throw new ApiError(403, 'Access denied');

  // chk if the project exists
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'Unauthorized');

  //get project members
  const projectMembers = await ProjectMember.find({ project: project._id });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMembers,
        'Project members fetched successfully',
      ),
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');
  const projectId = req.params?.projectId;
  if (!projectId) throw new ApiError(400, 'Project ID is required');
  const userId = req.params?.userId;
  if (!userId) throw new ApiError(400, 'User ID is required');
  if (user._id.equals(userId)) {
    throw new ApiError(400, 'Cannot change your own role');
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const { role } = req.body;
  if (!role) throw new ApiError(400, 'Role must be specified');
  if (!AvailableUserRole.includes(role)) {
    throw new ApiError(400, 'Invalid user role');
  }

  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });
  //
  if (!membership || membership.role !== 'admin')
    throw new ApiError(403, 'Invalid access');
  // chk whether project exists
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'Project not found');
  //chk user belongs to that project
  const projectMember = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!projectMember)
    throw new ApiError(404, 'User is not a member of this project');

  projectMember.role = role;

  await projectMember.save();

  res
    .status(200)
    .json(new ApiResponse(200, projectMember, 'Role updated successfully'));
});

const deleteMember = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, 'Unauthorized');

  const projectId = req.params.projectId;
  const memberId = req.params.userId;
  if (!projectId || !memberId)
    throw new ApiError(400, 'Either project ID or member ID is missing');
  const validUserId = mongoose.Types.ObjectId.isValid(memberId);
  const validProjectId = mongoose.Types.ObjectId.isValid(projectId);
  if (!validUserId || !validProjectId)
    throw new ApiError(400, 'Invalid ID format');

  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, 'Project not found');

  const membership = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(user._id),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!membership) throw new ApiError(403, 'Invalid access');

  if (membership.role !== 'admin' && membership.role !== 'project_admin')
    throw new ApiError(403, "Only admin's can remove a member");

  const projectMember = await ProjectMember.findOne({
    user: new mongoose.Types.ObjectId(memberId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!projectMember) throw new ApiError(404, 'Project member not found');

  await ProjectMember.findOneAndDelete({
    user: new mongoose.Types.ObjectId(memberId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  res
    .status(200)
    .json(new ApiResponse(200, [], 'Project member deleted successfully'));
});

export {
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
};
