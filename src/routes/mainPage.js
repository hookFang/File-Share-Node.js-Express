var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");

/* GET main page after login/signup. */
router.get("/", function (req, res) {
  if (req.user) {
    UploadFile.find({ owner: req.user.id }, function (err, filesFound) {
      if (err) console.log(err);
      res.render("mainPage", { user: req.user, files: filesFound });
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
