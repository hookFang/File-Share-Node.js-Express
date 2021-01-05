var Users = require("../models/user");
var jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req, res, next) => {
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
      req.email = user.email;
      console.log(user._id);
    }
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
