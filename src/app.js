
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import download from './routes/download';
import mongoose from 'mongoose';


//Connect to the Mongo databse
try {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open', function (callback) {
        console.log('Connected to MongoDB');
    });
} catch (err) {
    console.log("Error : " + err);
}


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use('/download/:urlShortCode', function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
}, download);

app.get('/public/*', function(req, res, next) {
        res.end('You are not allowed!');
});

app.listen(PORT, () => {
    console.log(`File Share Application is running on ${PORT}!`);
});
