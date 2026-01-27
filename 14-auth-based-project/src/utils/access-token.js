import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
  const { _id, email } = user;
  const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};

export const decodeAccessToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
