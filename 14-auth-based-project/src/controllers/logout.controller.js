// get the refresh token and acess token of the user and set it "";
import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import { hashRefreshToken } from "../utils/refresh-token.js";
import userModel from "../models/user.model.js";

const handleLogout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(400).json(new ApiResponse(400, "Invalid Token"));
  const tokenHash = hashRefreshToken(refreshToken);
  const user = await userModel.findOneAndUpdate(
    { refreshToken: tokenHash },
    { $set: { refreshToken: "" } },
  );
  if (!user)
    return res.status(401).json(new ApiResponse(401, "Unauthorized access"));

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json(new ApiResponse(200, "Logout successful"));
});

export default handleLogout;
