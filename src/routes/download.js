import { Router } from 'express';
import UploadFile from '../models/uploadFile';
import path from 'path';

const router = Router();

//POST method
router.get('/', async (req, res) => {
    const fileDetails = await UploadFile.findDownloadFile(req.shortCode);
    const file = path.join(__dirname, '../public/files/' + fileDetails.fileName);
    res.download(file);
});

export default router;