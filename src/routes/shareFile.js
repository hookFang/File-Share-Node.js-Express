import { Router } from "express";
import UploadFile from "../models/uploadFile";
import formidable from "formidable";

const router = Router();

router.post("/", async function (req, res) {
    console.log("here in router")
        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {

            if (req.user) console.log(req.user);
            if (fields.userEmail) console.log(fields.userEmail);
            
            const fileDetails = await UploadFile.findDownloadFile(fields.fileHidden);

            if (fields.userHidden == fileDetails.owner) {
                await UploadFile.findOneAndUpdate({ urlShortCode: fields.fileHidden }, { $addToSet: { sharedWithUsers: fields.userEmail } }, { new: true, upsert: true });
                res.redirect("/mainPage");
            } else {
                console.log("here")
            }
        });
});

module.exports = router;