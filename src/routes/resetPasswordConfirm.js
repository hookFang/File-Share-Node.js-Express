import { Router } from "express";
import Users from "../models/user";
import bcrypt from "bcryptjs";

const router = Router();
/* Reset Password GET action */
router.get("/", function (req, res) {
  Users.findOne(
    {
      resetPasswordToken: req.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        return res.render("resetPasswordConfirm", { verification: 0 });
      } else {
        res.render("resetPasswordConfirm", { token: req.token });
      }
    }
  );
});

/*Reset Password POST action*/
router.post("/", function (req, res) {
  Users.findOne(
    {
      resetPasswordToken: req.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        return res.render("resetPasswordConfirm", { verification: 0 });
      } else {
        if (req.body.password == req.body.confirmPassword) {
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            user.password = hash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            //Save the new password
            user.save(function (err) {
              if (err) console.log(err);
              return res.render("resetPasswordConfirm", { verification: 2 });
            });
          });
        } else {
          return res.render("resetPasswordConfirm", {
            verification: 1,
            token: req.token,
          });
        }
      }
    }
  );
});

module.exports = router;
