import { Router } from "express";
import UploadFile from "../models/uploadFile";

const router = Router();

/* GET main page after login/signup. */
router.get("/", function (req, res) {
  UploadFile.find({ sharedWithUsers: req.user.email }, function (err, filesFound) {
    if (err) console.log(err);
    res.render("availableFiles", { user: req.user, files: filesFound });
  });
});

module.exports = router;
