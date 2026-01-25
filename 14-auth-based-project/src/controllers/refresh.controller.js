

import asyncHandler from "../utils/async-handler.js";
import { hashRefreshToken } from "../utils/refresh-token.js";
import userModel from "../models/user.model.js";
import { generateAccessToken } from "../utils/access-token.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";


const handleRefresh = asyncHandler(async (req, res) => {
 
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken)
    return res.status(404).json(new ApiError(404, "Unauthorized access"));

  const tokenHash = hashRefreshToken(refreshToken);
  
  const user = await userModel.findOne({ refreshToken: tokenHash });
  
  if (!user)
    return res.status(404).json(new ApiError(404, "Unauthorized access"));

  const accessToken = generateAccessToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json(new ApiResponse(201, "Refresh Successful"));
});

export default handleRefresh;