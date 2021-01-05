var express = require("express");
var router = express.Router();
var Users = require("../models/user");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var sanitize = require("mongo-sanitize");

router.get("/", function (req, res) {
  res.render("resetPassword");
});

router.post("/", async function (req, res) {
  const emailID = sanitize(req.body.email);
  var token = await generateToken();
  Users.findOne({ email: emailID }, function (err, user) {
    if (!user) {
      return res.render("resetPassword", { verification: 0 });
    } else {
      (user.resetPasswordToken = token),
        (user.resetPasswordExpires = Date.now() + 3600000),
        user.save(async function (err) {
          await sendVerificationEmail(emailID, token);
          res.render("resetPassword", { verification: 1 });
        });
    }
  });
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
    subject: "Password Reset File Share",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "http://" +
      process.env.EMAIL_HOSTNAME +
      "/resetPasswordConfirm/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email .\n",
  };
  smtpTransport.sendMail(mailOptions, function (err) {
    if (err) console.log(err);
  });
}

module.exports = router;
