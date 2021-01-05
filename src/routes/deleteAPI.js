var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");
var fs = require("fs");
var path = require("path");

//DELETE method
router.delete("/", async (req, res) => {
  //Deletes the data from MongoDB
  const fileDetails = await UploadFile.findDownloadFile(req.shortCode);
  let user = null;

  if (req.user) {
    user = await req.user.id;
  }

  if (!fileDetails) {
    res.send("No file Exist");
  }

  if (fileDetails.owner) {
    if (req.userID == fileDetails.owner || user == fileDetails.owner) {
      UploadFile.findOneAndDelete(
        { urlShortCode: req.shortCode },
        function (err, deletedFile) {
          console.log(deletedFile);
          if (err) console.log(err);
          //Removes the file from the directory
          let filePath = "./public/files/" + deletedFile.fileName;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          console.log(
            "Data removed from  MongoDB, File will be deleted soon !"
          );
          res.send("File Deleted Successfully!");
        }
      );
    } else {
      res.sendStatus(401);
    }
  } else {
    UploadFile.findOneAndDelete(
      { urlShortCode: req.shortCode },
      function (err, deletedFile) {
        console.log(deletedFile);
        if (err) console.log(err);
        //Removes the file from the directory
        fs.unlinkSync(
          path.join(__dirname, "../../public/files/" + deletedFile.fileName)
        );
        console.log("Data removed from  MongoDB, File will be deleted soon !");
        res.send("File Deleted Successfully!");
      }
    );
  }
});

module.exports = router;
