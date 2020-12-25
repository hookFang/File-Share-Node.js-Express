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
router.post("/", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.render("login");
    }
    if (!user) {
      return res.render("login", { falsePasswordValidation: true });
    }
    if (user.confirmedEmail == false) {
      return res.render("emailVerification", { verification: 4 });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.session.save(function () {
        res.redirect("/mainPage");
      });
    });
  })(req, res, next);
});

module.exports = router;
