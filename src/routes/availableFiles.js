var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");

/* GET main page after login/signup. */
router.get("/", function (req, res) {
  UploadFile.find(
    { sharedWithUsers: req.user.email },
    function (err, filesFound) {
      if (err) console.log(err);
      res.render("availableFiles", { user: req.user, files: filesFound });
    }
  );
});

module.exports = router;
