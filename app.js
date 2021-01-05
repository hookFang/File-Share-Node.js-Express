var dotenv = require("dotenv/config");
var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var CronJob = require("cron").CronJob;
var moment = require("moment");
var path = require("path");
var fs = require("fs");
var session = require("express-session");
var bcrypt = require("bcryptjs");
var cookieParser = require("cookie-parser");

//Custom Modules
var Users = require("./src/models/user");
var shareFile = require("./src/routes/shareFile");
var UploadFile = require("./src/models/uploadFile");
var routes = require("./src/routes/index");
var uploadAPI = require("./src/routes/uploadAPI");
var downloadAPI = require("./src/routes/downloadAPI");
var signUpAPI = require("./src/routes/signUpAPI");
var loginAPI = require("./src/routes/loginAPI");
var finishedUpload = require("./src/routes/finishedUpload");
var deleteFile = require("./src/routes/deleteAPI");
var download = require("./src/routes/download");
var upload = require("./src/routes/upload");
var login = require("./src/routes/login");
var about = require("./src/routes/about");
var register = require("./src/routes/register");
var verifyToken = require("./src/routes/middleware").verifyToken;
var mainPage = require("./src/routes/mainPage");
var refresh = require("./src/routes/authenticationHelper").refresh;
var shareFileAPI = require("./src/routes/shareFileAPI");
var availableFiles = require("./src/routes/availableFiles");
var emailVerificationConfirm = require("./src/routes/emailVerificationConfirm");
var resendEmailVerification = require("./src/routes/resendEmailVerification");
var resetPassword = require("./src/routes/resetPassword");
var resetPasswordConfirm = require("./src/routes/resetPasswordConfirm");

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
  console.log(
    "This Cron Job runs every Minute to delete expired files and data from MongoDB"
  );
  UploadFile.find({}, function (err, filesFound) {
    if (err) console.log(err);
    //Loops through each element and deletes them if expired
    filesFound.forEach((element) => {
      if (
        moment.tz(element.urlExpiry, "America/Toronto").format() <
        moment().tz("America/Toronto").format()
      ) {
        let id = element.id;
        let fileName = element.fileName;
        UploadFile.findByIdAndDelete(id, function (err, model) {
          //Delete the file too
          let filePath = "./public/files/" + fileName;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// required for passport session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);
app.use("/logout", routes);
app.use("/uploadAPI", verifyToken, uploadAPI);
app.use("/signUpAPI", signUpAPI);
app.use("/loginAPI", loginAPI);
app.use("/upload", upload);
app.use("/shareFile", shareFile);
app.use("/about", about);
app.use("/mainPage", mainPage);
app.use("/availableFiles", availableFiles);
app.use("/resetPassword", resetPassword);
app.use("/resendEmailVerification", resendEmailVerification);
app.use(
  "/finishedUpload/:shortCode",
  function (req, res, next) {
    req.shortCode = req.params.shortCode;
    next();
  },
  finishedUpload
);
app.use(
  "/shareFileAPI/:fileCode/:emailID",
  verifyToken,
  function (req, res, next) {
    req.fileCode = req.params.fileCode;
    req.emailID = req.params.emailID;
    next();
  },
  shareFileAPI
);
app.use(
  "/downloadAPI/:urlShortCode",
  verifyToken,
  function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
  },
  downloadAPI
);
app.use(
  "/deleteAPI/:urlShortCode",
  verifyToken,
  function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
  },
  deleteFile
);
app.use("/login", login);
app.use("/refresh", refresh);
app.use("/register", register);
app.use(
  "/download/:urlShortCode",
  function (req, res, next) {
    req.shortCode = req.params.urlShortCode;
    next();
  },
  download
);
app.use(
  "/emailVerification/:token",
  function (req, res, next) {
    req.token = req.params.token;
    next();
  },
  emailVerificationConfirm
);
app.use(
  "/resetPasswordConfirm/:token",
  function (req, res, next) {
    req.token = req.params.token;
    next();
  },
  resetPasswordConfirm
);

//Removes access to all the download files
app.all("/files/*", function (req, res, next) {
  res.status(403).send({
    message: "Access Forbidden",
  });
});
app.use("/files", express.static(path.join(__dirname, "files")));

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
  new LocalStrategy(function (username, password, done) {
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
