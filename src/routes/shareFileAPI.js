"use strict";
import { Router } from "express";
import Users from "../models/user";
import UploadFile from "../models/uploadFile";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
  if (req.userID) {
    console.log(req.fileCode);
    console.log(req.emailID);

    const fileDetails = await UploadFile.findDownloadFile(req.fileCode);

    if (req.userID == fileDetails.owner) {
      await UploadFile.findOneAndUpdate({ urlShortCode: req.fileCode }, { $addToSet: { sharedWithUsers: req.emailID } }, { new: true, upsert: true });
    } else {
      return res.sendStatus(401);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
