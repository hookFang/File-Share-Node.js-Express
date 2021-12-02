var express = require("express");
var router = express.Router();
var formidable = require("formidable");
var Web3Storage = require("web3.storage");


function getAccessToken() { return process.env.WEB3STORAGE_TOKEN }

function makeStorageClient() {  return new Web3Storage.Web3Storage({ token: getAccessToken() })}

router.get("/", function (req, res) {
    res.render("ipfsUpload");
})

router.post("/", function (req, res) {
    var form = new formidable.IncomingForm();
    form.on("file", async function (fields, files) {
        const files = await Web3Storage.getFilesFromPath(files.filepath)
        const client = makeStorageClient() 
        const cid = await client.put(files)  
        return cid
    });
    return null;
});

module.exports = router;
