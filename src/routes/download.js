var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");
var path = require("path");

//GET method
router.get("/", function (req, res) {
  res.render("download", { shortCode: req.shortCode });
});

//POST method
router.post("/", async function (req, res) {
  const fileDetails = await UploadFile.findDownloadFile(req.shortCode);
  if (fileDetails) {
    if (!fileDetails.owner) {
      const file = path.join(
        __dirname,
        "../../public/files/" + fileDetails.fileName
      );
      res.download(file);
    } else {
      //Check if the user who requested the file is a valid user and then allows the user to download
      let isValidUser = false;
      if (req.user) {
        if (req.user.id == fileDetails.owner) {
          isValidUser = true;
        }
        if (req.user.email) {
          for (let users of fileDetails.sharedWithUsers) {
            if (req.user.email == users) {
              isValidUser = true;
            }
          }
        }
      }
      //If valis user file starts downloading
      if (isValidUser) {
        const file = path.join(
          __dirname,
          "../../public/files/" + fileDetails.fileName
        );
        return res.download(file);
      } else {
        return res.render("login", { requiresLogin: true });
      }
    }
  }
});

module.exports = router;
