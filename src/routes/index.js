import { Router } from 'express';
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
        const fileDetails = new UploadFile({ fileName: files.upload.name, urlShortCode: nanoid() })

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