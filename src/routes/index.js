import { Router, text } from 'express';
import { nanoid } from 'nanoid'
import UploadFile from '../models/uploadFile';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';


const router = Router();

//POST method
router.post('/', async (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/files');
    form.parse(req, function (err, fields, files) {
        //Update filename
        //files.upload.name = fields.title + '.' + files.upload.name.split('.')[1];
        console.log(files.upload.name);
        //Upload file on our server
        fs.rename(files.upload.path, path.join(form.uploadDir, files.upload.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Received upload');

        //Uploads the data on the carr listing to mongo db
        //Gets the value inserted
        //if urlExpiry field does not exist, automatically put an expiry of one hour
        //else assign expiry hour using user
        if (!fields.urlExpiry)
        {
            var expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);
            var fileDetails = new UploadFile({ fileName: files.upload.name, urlShortCode: nanoid(), urlExpiry: expireDate })
        }
        else
        {
            var expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + parseInt(fields.urlExpiry));
            var fileDetails = new UploadFile({ fileName: files.upload.name, urlShortCode: nanoid(), urlExpiry: expireDate })
        }
        //Saves the Car add
        fileDetails.save(function (err) {
            if (err) console.log(err);
            res.send("File Uploaded successfuly")
        });
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded, and Data added to Mongo DB');
    });
});

export default router;