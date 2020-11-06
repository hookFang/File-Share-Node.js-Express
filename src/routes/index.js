import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

module.exports = router;
