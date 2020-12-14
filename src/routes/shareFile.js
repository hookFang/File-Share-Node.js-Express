import { Router } from "express";
import UploadFile from "../models/uploadFile";

const router = Router();

router.post("/", async function (req, res) {
  if (req.body.urlShortCodeID) {
    //gets the file details
    const fileDetails = await UploadFile.findDownloadFile(req.body.urlShortCodeID);
    console.log(fileDetails);
    //Checks if the file belong to the user, if it belongs to the user they share the file to the email
    if (req.user.id == fileDetails.owner) {
      await UploadFile.findOneAndUpdate(
        { urlShortCode: req.body.urlShortCodeID },
        { $addToSet: { sharedWithUsers: req.body.userEmail } },
        { new: true, upsert: true }
      );
      res.redirect("/mainPage");
    } else {
      res.redirect("/mainPage");
    }
  }
});

module.exports = router;
