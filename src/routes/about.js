"use strict";
var express = require("express");
var router = express.Router();

/*GET for login*/
router.get("/", function (req, res) {
  res.render("about", { user: req.user });
});

module.exports = router;
