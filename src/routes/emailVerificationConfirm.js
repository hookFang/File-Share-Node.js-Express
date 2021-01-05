var express = require("express");
var router = express.Router();
var Users = require("../models/user");

/*Confirm Email is verified*/
router.get("/", function (req, res) {
  Users.findOne(
    {
      confirmEmailToken: req.token,
      confirmEmailExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        console.log("Email Verification Token Invalid or has Expired");
        return res.render("emailVerification", { verification: 1 });
      } else {
        //if the token and date is valid the user is updated
        user.confirmEmailToken = undefined;
        user.confirmEmailExpires = undefined;
        user.confirmedEmail = true;
        user.save(function (err) {
          if (err) console.log(err);
          return res.render("emailVerification", { verification: 0 });
        });
      }
    }
  );
});

module.exports = router;
