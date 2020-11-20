import { Router } from "express";
import UploadFile from "../models/uploadFile";
import fs from "fs";
import path from "path";

const router = Router();

//DELETE method
router.delete("/", (req, res) => {
  //Deletes the data from MongoDB
  UploadFile.findOneAndDelete({ urlShortCode: req.shortCode }, function (err, deletedFile) {
    console.log(deletedFile);
    if (err) console.log(err);
    //Removes the file from the directory
    fs.unlinkSync(path.join(__dirname, "../../public/files/" + deletedFile.fileName));
    console.log("Data removed from  MongoDB, File will be deleted soon !");
    res.send("File Deleted Successfully!");
  });
});

export default router;
