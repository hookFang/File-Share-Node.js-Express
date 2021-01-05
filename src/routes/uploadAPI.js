var express = require("express");
var router = express.Router();
var nanoid = require("nanoid").nanoid;
var UploadFile = require("../models/uploadFile");
var path = require("path");
var fs = require("fs");
var formidable = require("formidable");
var moment = require("moment");

//POST method
router.post("/", async (req, res) => {
  console.log(req);
  let canadaTime = moment().tz("America/Toronto");
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, "../../public/files");
  form.parse(req, function (err, fields, files) {
    //Update filename
    //files.upload.name = fields.title + '.' + files.upload.name.split('.')[1];
    console.log(files.upload.name);
    //Upload file on our server
    fs.rename(
      files.upload.path,
      path.join(form.uploadDir, files.upload.name),
      function (err) {
        if (err) console.log(err);
      }
    );
    console.log("Received upload");

    //Check if URLEXPIRY field is filled in or sets a default value with 1 hour
    if (!fields.urlExpiryTime) {
      canadaTime.add(1, "hours");
    } else {
      canadaTime.add(parseInt(fields.urlExpiryTime), "hours");
    }

    if (!req.userID) {
      var fileDetails = new UploadFile({
        fileName: files.upload.name,
        urlShortCode: nanoid(),
        urlExpiry: canadaTime.format(),
      });
    } else {
      var fileDetails = new UploadFile({
        fileName: files.upload.name,
        owner: req.userID,
        urlShortCode: nanoid(),
        urlExpiry: canadaTime.format(),
      });
    }

    //Save the file Details
    fileDetails.save(function (err) {
      if (err) console.log(err);
      let origin = req.get("host");
      res.send(
        "File Uploaded successfuly.The file shortCode is : " +
          fileDetails.urlShortCode +
          "\n The download API should be like this: " +
          req.get("host") +
          "/downloadAPI/shortCode"
      );
    });
  });
  form.on("end", function (err, fields, files) {
    console.log("File successfuly uploaded, and Data added to Mongo DB");
  });
});

module.exports = router;
