var express = require("express");
var router = express.Router();
const ipfsClient = require("ipfs-http-client");
//URL for the API server were the ipfs node is hosted
const ipfs = ipfsClient("URL");

/*Code reffered from : https://medium.com/coinmonks/ipfs-tutorial-sending-and-getting-files-via-nodejs-backend-85c85ae7f6f6 */
/* POST for ipfs upload - Work in progress */
router.post("/", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //Reading the file
    let testFile = fs.readFileSync(files.upload.path);
    //Creating buffer for ipfs function to add file to the system
    let testBuffer = new Buffer(testFile);

    ipfs.files.add(testBuffer, function (err, file) {
      if (err) {
        console.log(err);
      }
      console.log(file);
    });
  });
  form.on("end", function (err, fields, files) {
    console.log("File successfuly uploaded, and Data added to Mongo DB");
  });
});
