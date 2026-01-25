// 1. Validate request
// 2. Hash password
// 3. Create user (role = USER)
// 4. Generate refresh token
// 5. Hash refresh token → store in DB
// 6. Set refresh token as HTTP-only cookie
// 7. Generate access token (JWT)
// 8. Send access token to client

import asyncHandler from "../utils/async-handler.js";
import userModel from "../models/user.model.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../utils/refresh-token.js";
import refreshTokenModel from "../models/refresh-token.model.js";
import {
  generateAccessToken,
  decodeAccessToken,
} from "../utils/access-token.js";

import { ApiError } from "../utils/api-error.js";

import { ApiResponse } from "../utils/api-response.js";

const handleRegistration = asyncHandler(async (req, res, next) => {
  // console.log(`req recieved`);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(new ApiError(404, "All the fields are mandatory"));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json(new ApiResponse(409, "User already exists"));
  }
const refreshToken = generateRefreshToken();
const tokenHash = hashRefreshToken(refreshToken);

  const user = await userModel.create({
    username,
    email,
    password,
    refreshToken:tokenHash,
  });

  
  // user.refreshToken = refreshToken;
  // console.log(user);
  

  await refreshTokenModel.create({
    user: user._id,
    tokenHash,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const accessToken = generateAccessToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json(new ApiResponse(201, "User created successfully"));
});

export default handleRegistration;
