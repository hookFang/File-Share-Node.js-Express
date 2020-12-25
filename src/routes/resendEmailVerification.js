import { Router } from "express";
import Users from "../models/user";
import crypto from "crypto";
import async from "async";
import nodemailer from "nodemailer";

const router = Router();
router.get("/", function (req, res) {
  res.render("resendEmailVerification");
});

/*Resend Verification E-mail*/
router.post("/", async function (req, res) {
  const emailID = req.body.email;
  var token = await generateToken();
  Users.findOne({ email: emailID }, function (err, user) {
    if (!user) {
      return res.redirect("/resendEmailVerification");
    } else {
      if (user.confirmedEmail == true) {
        res.render("emailVerification", { verification: 3 });
      } else {
        (user.confirmPasswordToken = token),
          (user.confirmPasswordExpires = Date.now() + 3600000),
          user.save(async function (err) {
            await sendVerificationEmail(emailID, req, token);
            res.render("emailVerification", { verification: 2 });
          });
      }
    }
  });
});

async function generateToken() {
  const buffer = crypto.randomBytes(16);
  return buffer.toString("hex");
}

async function sendVerificationEmail(emailID, req, token) {
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
    subject: "A file has been shared with you",
    text:
      "You are receiving this because you (or someone else) have signed up for a new account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the email Verification:\n\n" +
      "http://" +
      req.headers.host +
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
