import { Router } from "express";
import UploadFile from "../models/uploadFile";
import nodemailer from "nodemailer";

const router = Router();

router.post("/", async function (req, res) {
  if (req.body.urlShortCodeID) {
    //gets the file details
    const urlShortCode = await req.body.urlShortCodeID;
    const emailID = await req.body.userEmail;
    const fileDetails = await UploadFile.findDownloadFile(urlShortCode);
    console.log(fileDetails);
    //Checks if the file belong to the user, if it belongs to the user they share the file to the email
    if (req.user.id == fileDetails.owner) {
      await UploadFile.findOneAndUpdate(
        { urlShortCode: urlShortCode },
        { $addToSet: { sharedWithUsers: emailID } },
        { new: true, upsert: true }
      );
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
        to: req.body.userEmail,
        from: "<info@edwinchristie.tech>", // This is ignored by Gmail
        subject: "A file has been shared with you",
        text:
          "Hello,\n\n" +
          "A file has been shared with you. Please login to access the File.",
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash("success", "File Shared");
        done(err);
      });
      res.redirect("/mainPage");
    } else {
      res.redirect("/mainPage");
    }
  }
});

module.exports = router;
