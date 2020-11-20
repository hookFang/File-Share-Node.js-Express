"use strict";
import { Router } from "express";
import passport from "passport";

const router = Router();

/*POST for login*/
//This will check if there is tocken, if not it will assign a tocken to the cookie
router.post("/", function (req, res) {
  let tokenFound = req.cookies.auth;
});

module.exports = router;
