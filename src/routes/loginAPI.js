"use strict";
import { Router } from "express";
import Users from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

/*POST for login*/
//This will check if there is token, if not it will assign a token to the cookie
router.post("/", async function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  var userValue = null;

  await Users.findOne(
    {
      email: email,
    },
    function (err, user) {
      if (err) {
        res.sendStatus(401);
      }

      if (!user) {
        res.sendStatus(401);
      } else {
        //Compare hashed passwords
        if (!bcrypt.compareSync(password, user.password)) {
          res.sendStatus(401);
        } else {
          userValue = user;
        }
      }
    }
  );

  let payload = { email };
  //For access token
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });

  if (userValue) {
    Users.findByIdAndUpdate(userValue.id, { refreshToken: refreshToken }, function (err, model) {
      if (err) console.log(err);
      console.log("Token updated successfully to the database");
    });
    res.cookie("jwt", accessToken, { httpOnly: true });
    res.send({
      user: {
        email: userValue.email,
      },
      accessToken,
    });
  }
});

module.exports = router;
