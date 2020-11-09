import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

/*Logout*/
router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

module.exports = router;
