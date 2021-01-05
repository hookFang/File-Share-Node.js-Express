var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  var shareLink = process.env.EMAIL_HOSTNAME + "/download/" + req.shortCode;
  res.render("index", { fileSaved: true, shareLink: shareLink });
});

module.exports = router;
