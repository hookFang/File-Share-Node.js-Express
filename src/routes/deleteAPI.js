import { Router } from "express";
import UploadFile from "../models/uploadFile";
import fs from "fs";
import path from "path";

const router = Router();

//DELETE method
router.delete("/", async (req, res) => {
  //Deletes the data from MongoDB
  const fileDetails = await UploadFile.findDownloadFile(req.shortCode);
  if (!fileDetails) {
    return res.send("No file Exist");
  }
  if (fileDetails.owner) {
    if (req.userID == fileDetails.owner) {
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

export default router;
