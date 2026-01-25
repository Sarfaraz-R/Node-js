// take user email and pass
// check in database if the user exists
// if not return unauthorized access
//if yes generate him a refresh and access token
// store the hashedrefresh token into database with expiry time

import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
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

const handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(404)
      .json(new ApiError(404, "All the fields are mandatory"));
  // validating the credentials
  const user = await userModel.findOne({ email: email });
  if (!user)
    return res.status(404).json(new ApiError(401, "Unauthorized Access"));

  const validPass = await user.isPasswordCorrect(password);
  if (!validPass)
    return res.status(404).json(new ApiError(401, "Unauthorized Access"));

  //generate him a refreshtoken
  const refreshToken = generateRefreshToken();
  user.refreshToken=refreshToken;
  const tokenHash = hashRefreshToken(refreshToken);
  //storing token hash into database
   await refreshTokenModel.create({
    user: user._id,
    tokenHash,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
   await userModel.findOneAndUpdate({email:email},{$set:{refreshToken:tokenHash}});
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

  res.status(200).json(new ApiResponse(200, "Login Successful"));
});

export default handleLogin;
