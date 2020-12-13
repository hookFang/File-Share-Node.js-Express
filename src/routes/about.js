"use strict";
import { Router } from "express";

const router = Router();

/*GET for login*/
router.get("/", function (req, res) {
  res.render("about", { user: req.user });
});

module.exports = router;
