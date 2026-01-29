import { User } from '../models/user.models.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

import { sendEmail } from '../utils/mail.js';
import asyncHandler from '../utils/async-handler.js';
import { emailVerificationMailgenContent } from '../utils/mail.js';
import jwt from 'jsonwebtoken';

const generateTokens = async (user) => {
  try {
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Error while generating tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, 'User with email or password already exists', []);
  }
  const user = await User.create({
    username,
    email,
    password,
  });

  const { refreshToken, accessToken } = await generateTokens(user);

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // await sendEmail({
  //   email: user?.email,
  //   subject: 'Please verify your email',
  //   mailgenContent: emailVerificationMailgenContent(
  //     user.username,
  //     `${req.protocol}://${req.get('host')}/api/users/verify-email/${unHashedToken}`,
  //   ),
  // });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken ',
  );
  if (!createdUser)
    throw new ApiError(500, 'Something went wrong while registering the user');

  return res
    .status(201)
    .json(
      new ApiResponse(200, { user: createdUser }, 'user created successfully'),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username)
    throw new ApiError(400, 'Either email or username is Required');

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) throw new ApiError(400, 'User not found');

  const validPassword = await user.isPasswordCorrect(password);

  if (!validPassword) throw new ApiError(400, 'Invalid credentials');

  const { accessToken, refreshToken } = await generateTokens(user);

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken ',
  );
  if (!createdUser)
    throw new ApiError(500, 'Something went wrong while logging-in the user');

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(200, { user: createdUser }, 'User login successful'));
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    user._id,
    { $set: { refreshToken: '' } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, { user: user }, 'User logout successful'));
});

const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(400, 'Nothing to show');
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: user },
        'Current user data fetched successfully',
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) throw new ApiError(401, 'Unauthorized Access');

  const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded?._id);

  if (!user) throw new ApiError(401, 'Unauthorized Access');
  // console.log('Incoming token:', incomingToken);
  // console.log('DB token:', user.refreshToken);
  // console.log('Equal:', incomingToken === user.refreshToken);

  if (user.refreshToken !== incomingToken)
    throw new ApiError(409, 'token invalid');

  const { accessToken, refreshToken } = await generateTokens(user);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, {}, 'Refresh Successful'));
});

const changePassword = asyncHandler(async (req, res) => {
  //accessToken verified by jwtauth
  const { newPassword } = req.body;

  if (!newPassword) throw new ApiError(400, 'Password is required');

  const id = req.user?._id;

  const user = await User.findById(id);

  if (!user) throw new ApiError(400, 'Unable to find the user');

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password updated successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  refreshAccessToken,
  changePassword,
};
