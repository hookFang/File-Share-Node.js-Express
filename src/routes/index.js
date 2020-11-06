import { Router, text } from 'express';
import { nanoid } from 'nanoid'
import UploadFile from '../models/uploadFile';
import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import moment from 'moment';

const router = Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index')
});

/*POST for the Upload button in the index page*/
router.post('/', function (req, res) {
   console.log("File is here")

   let canadaTime = moment().tz("America/Toronto");
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../public/files');
    form.parse(req, function (err, fields, files) {
        console.log(files.upload.name);
        //Upload file on our server
        fs.rename(files.upload.path, path.join(form.uploadDir, files.upload.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Received upload');
        //By default uploading through UI will have a expiry of 4 hours
        canadaTime.add(4, 'hours');
        
        var fileDetails = new UploadFile({ fileName: files.upload.name, urlShortCode: nanoid(), urlExpiry: canadaTime.format() })

        //Save the file Details
        fileDetails.save(function (err) {
            if (err) console.log(err);
            let shareLink = req.get('host') + "/download/" + fileDetails.urlShortCode;
            return res.render('index', {fileSaved: true, shareLink: shareLink});
        });
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded, and Data added to Mongo DB');
    });
});


module.exports = router;