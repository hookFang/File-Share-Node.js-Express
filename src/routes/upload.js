import { Router } from "express";
import { nanoid } from "nanoid";
import UploadFile from "../models/uploadFile";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import moment from "moment";
import { userInfo } from "os";

const router = Router();

/*POST for the Upload button in the index page*/
router.post("/", function (req, res) {
  let canadaTime = moment().tz("America/Toronto");
  var form = new formidable.IncomingForm();
  var dir = path.join(__dirname, "../../public/files");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  form.uploadDir = dir;
  form.parse(req, function (err, fields, files) {
    console.log(files.upload.name);
    //Upload file on our server
    fs.rename(files.upload.path, path.join(form.uploadDir, files.upload.name), function (err) {
      if (err) console.log(err);
    });
    console.log("Received upload");
    //By default uploading through UI will have a expiry of 4 hours
    canadaTime.add(4, "hours");

    if (fields.userHidden) console.log(fields.userHidden);

    if (!fields.userHidden) {
      var fileDetails = new UploadFile({
        fileName: files.upload.name,
        urlShortCode: nanoid(),
        urlExpiry: canadaTime.format(),
      });
    } else {
      var fileDetails = new UploadFile({
        fileName: files.upload.name,
        owner: fields.userHidden,
        urlShortCode: nanoid(),
        urlExpiry: canadaTime.format(),
      });
    }
    //Save the file Details
    fileDetails.save(function (err) {
      if (err) console.log(err);
      let shareLink = req.get("host") + "/download/" + fileDetails.urlShortCode;
      if (!fields.userHidden) {
        res.render("index", { fileSaved: true, shareLink: shareLink });
      } else {
        res.redirect("/mainPage");
      }
    });
  });
  form.on("end", function (err, fields, files) {
    console.log("File successfuly uploaded, and Data added to Mongo DB");
  });
});

module.exports = router;
