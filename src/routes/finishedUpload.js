import { Router } from "express";
import { nanoid } from "nanoid";
import UploadFile from "../models/uploadFile";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import moment from "moment";

const router = Router();

router.get("/", function (req, res) {
  var shareLink = process.env.EMAIL_HOSTNAME + "/download/" + req.shortCode;
  res.render("index", { fileSaved: true, shareLink: shareLink });
});

module.exports = router;
