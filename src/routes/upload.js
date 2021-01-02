import { Router } from "express";
import { nanoid } from "nanoid";
import UploadFile from "../models/uploadFile";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import moment from "moment";

const router = Router();

/*POST for the Upload button in the index page*/
router.post("/", function (req, res) {
  let canadaTime = moment().tz("America/Toronto");
  var form = new formidable.IncomingForm();
  //The max upload size from the form
  form.maxFileSize = 2000 * 1024 * 1024;

  var dir = path.join(__dirname, "../../public/files");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  form.on("file", function (fields, files) {
    var myReadStream = fs.createReadStream(files.path);
    var myWriteStream = fs.createWriteStream(path.join(dir, files.name));

    myReadStream.pipe(myWriteStream);

    myWriteStream.on("finish", function () {
      console.log("Received upload");
      //By default uploading through UI will have a expiry of 3 hours
      if (fields.userHidden) {
        canadaTime.add(48, "hours");
      } else {
        canadaTime.add(3, "hours");
      }

      if (!fields.userHidden) {
        var fileDetails = new UploadFile({
          fileName: files.name,
          urlShortCode: nanoid(),
          urlExpiry: canadaTime.format(),
        });
      } else {
        var fileDetails = new UploadFile({
          fileName: files.name,
          owner: fields.userHidden,
          urlShortCode: nanoid(),
          urlExpiry: canadaTime.format(),
        });
      }
      //Save the file Details
      fileDetails.save(function (err) {
        if (err) console.log(err);
        let shareLink =
          req.get("host") + "/download/" + fileDetails.urlShortCode;
        if (!fields.userHidden) {
          res.send(fileDetails.urlShortCode);
        } else {
          res.send(true);
        }
      });
    });
  });

  form.on("end", function () {
    console.log("File successfuly uploaded, and Data added to Mongo DB");
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

module.exports = router;
