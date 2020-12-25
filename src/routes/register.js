"use strict";
import { Router } from "express";
import Users from "../models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sanitize from "mongo-sanitize";

const router = Router();

/*GET for register*/
router.get("/", function (req, res) {
  res.render("register");
});

/*POST for register*/
router.post("/", function (req, res) {
  //compare password and confirm password
  const emailID = sanitize(req.body.email);
  if (req.body.password === req.body.confirmPassword) {
    //Insert user
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      var token = await generateToken();
      var registerUser = {
        email: emailID,
        password: hash,
        confirmPasswordToken: token,
        confirmPasswordExpires: Date.now() + 3600000,
      };
      Users.find({ email: emailID }, function (err, user) {
        if (err) console.log(err);
        if (user.length) console.log("Username already exists please login.");
        const newUser = new Users(registerUser);
        newUser.save(async function (err) {
          if (err) console.log(err);
          await sendVerificationEmail(emailID, token);
          res.render("emailVerification", { verification: 2 });
        });
      });
    });
  } else {
    return res.render("register", { wrongPassword: true });
  }
});

async function generateToken() {
  const buffer = crypto.randomBytes(16);
  return buffer.toString("hex");
}

async function sendVerificationEmail(emailID, token) {
  var smtpTransport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    ignoreTLS: true, // I had to ignore tls because there was a version mismatch
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER, // smptp server user
      pass: process.env.NODEMAILER_PASSWORD, // smptp server password
    },
  });
  var mailOptions = {
    to: emailID,
    from: "<info@edwinchristie.tech>", // This is ignored by Gmail
    subject: "Please Verify your E-mail",
    text:
      "You are receiving this because you (or someone else) have signed up for a new account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the email Verification:\n\n" +
      "http://" +
      process.env.EMAIL_HOSTNAME +
      "/emailVerification/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email .\n",
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) console.log(err);
  });
}

module.exports = router;
