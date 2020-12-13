import jwt from "jsonwebtoken";
import Users from "../models/user";

export const verifyToken = async (req, res, next) => {
  let accessToken = req.cookies.jwt;

  if (!accessToken) {
    return next();
  }

  let payload;
  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
    const user = await Users.findOne({ email: payload.email });
    if (user) {
      req.userID = user._id;
      console.log(user._id);
    }
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};