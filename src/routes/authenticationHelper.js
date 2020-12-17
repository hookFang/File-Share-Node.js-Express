import Users from "../models/user";
import jwt from "jsonwebtoken";

export const refresh = async (req, res) => {
  let accessToken = req.cookies.jwt;

  if (!accessToken) {
    return res.sendStatus(403);
  }

  let payload;

  try {
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return res.sendStatus(401);
  }

  const user = await Users.findOne({ email: payload.email });
  const refreshToken = user.refreshToken;

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.sendStatus(401);
  }

  const newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  res.cookie("jwt", newToken, { httpOnly: true });
  res.send({
    user: {
      email: user.email,
    },
    accessToken,
  });
};
