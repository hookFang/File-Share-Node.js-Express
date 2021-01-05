var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");
var path = require("path");

//GET method
router.get("/", async (req, res) => {
  const fileDetails = await UploadFile.findDownloadFile(req.shortCode);
  if (fileDetails) {
    if (!fileDetails.owner) {
      const file = path.join(
        __dirname,
        "../../public/files/" + fileDetails.fileName
      );
      res.download(file);
    } else {
      let isValidUser = false;
      if (req.userID == fileDetails.owner) {
        isValidUser = true;
      }
      if (req.email) {
        for (let users of fileDetails.sharedWithUsers) {
          if (req.email == users) {
            isValidUser = true;
          }
        }
      }

      if (isValidUser) {
        const file = path.join(
          __dirname,
          "../../public/files/" + fileDetails.fileName
        );
        res.download(file);
      } else {
        res.sendStatus(403);
      }
    }
  } else {
    res.send("No File avaialble for download");
  }
});

module.exports = router;
