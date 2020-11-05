'use strict';
import { Router } from 'express';
import UploadFile from '../models/uploadFile';
import path from 'path';

const router = Router();


/* GET home page. */
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

/*POST for the Upload button in the index page*/
router.post('/', function (req, res) {
   
});


module.exports = router;