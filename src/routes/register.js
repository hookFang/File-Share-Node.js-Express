"use strict";
import { Router } from "express";
import Users from "../models/user";
import bcrypt from "bcryptjs";

const router = Router();

/*GET for register*/
router.get("/", function (req, res) {
  res.render("register");
});

/*POST for register*/
router.post("/", function (req, res) {
  //compare password and confirm password
  const emailID = req.body.email;
  if (req.body.password === req.body.confirmPassword) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      var registerUser = {
        email: emailID,
        password: hash,
      };
      //Check if user already exists
      Users.find({ email: emailID }, function (err, user) {
        if (err) console.log(err);
        if (user.length) console.log("Username already exists please login.");
        const newUser = new Users(registerUser);
        newUser.save(function (err) {
          console.log("Adding User");
          if (err) console.log(err);
          req.login(newUser, function (err) {
            console.log("Logging in the new user");
            if (err) console.log(err);
            return res.redirect("/mainPage");
          });
        });
      });
    });
  } else {
    console.log("Passwords do not match, pleas make sure they are the same.");
  }
});

module.exports = router;
