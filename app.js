import "dotenv/config";
import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import cors from "cors";
import routes from "./src/routes/index";
import uploadAPI from "./src/routes/uploadAPI";
import download from "./src/routes/downloadAPI";
import deleteFile from "./src/routes/deleteAPI";
import upload from "./src/routes/upload";
import login from "./src/routes/login";
import register from "./src/routes/register";
import mongoose from "mongoose";
import { CronJob } from "cron";
import UploadFile from "./src/models/uploadFile";
import moment from "moment";
import path from "path";
import fs from "fs";
import Users from "./src/models/user";
import session from "express-session";
import bcrypt from "bcryptjs";

//Connect to the Mongo databse
try {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var db = mongoose.connection;
  db.on("error", function (err) {
    console.log(err);
  });
  db.once("open", function (callback) {
    console.log("Connected to MongoDB");
  });
} catch (err) {
  console.log("Error : " + err);
}

//Cron Job to delete expired files and data
const job = new CronJob("0 */1 * * * *", function () {
  console.log("This Cron Job runs every Minute to delete expired files and data from MongoDB");
  UploadFile.find({}, function (err, filesFound) {
    if (err) console.log(err);
    //Loops through each element and deletes them if expired
    filesFound.forEach((element) => {
      if (moment.tz(element.urlExpiry, "America/Toronto").format() < moment().tz("America/Toronto").format()) {
        let id = element.id;
        let fileName = element.fileName;
        UploadFile.findByIdAndDelete(id, function (err, model) {
          //Delete the file too
          fs.unlinkSync("./public/files/" + fileName);
          console.log("File Deleted Succefully !");
        });
      }
    });
  });
});
job.start();

const app = express();
const PORT = process.env.PORT;

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// required for passport session
app.use(
  session({
    secret: "secrettexthere",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);
app.use("/logout", routes);
app.use("/uploadAPI", uploadAPI);
app.use("/upload", upload);
app.use(
  "/downloadAPI/:urlShortCode",
  function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
  },
  download
);
app.use(
  "/deleteAPI/:urlShortCode",
  function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
  },
  deleteFile
);
app.use("/login", login);
app.use("/register", register);

app.get("/public/*", function (req, res, next) {
  res.end("You are not allowed!");
});

//Serialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Deserialize user try to find username
passport.deserializeUser(function (id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

//Local strategy used for logging users
passport.use(
  new Strategy(function (username, password, done) {
    Users.findOne(
      {
        email: username,
      },
      function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        //Compare hashed passwords
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      }
    );
  })
);

app.listen(PORT, () => {
  console.log(`File Share Application is running on ${PORT}!`);
});
