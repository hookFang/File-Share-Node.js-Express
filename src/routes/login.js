"use strict";
import { Router } from "express";
import passport from "passport";

const router = Router();

/*GET for login*/
router.get("/", function (req, res) {
  res.render("login");
});

/*POST for login*/
//Try to login with passport
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: "Invalid Login",
  })
);

module.exports = router;
