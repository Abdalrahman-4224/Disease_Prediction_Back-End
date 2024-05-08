const path = require("path");
const fs = require("fs");
const multer = require("multer");
var maxSize= 50 * 1000 * 1000; //its 3MB
/* for multer upload lib */
exports.handle = (err, res) => {
    // res.status(500).contentType("text/plain")
    console.log(err);
    res.contentType("text/plain")
        .end("Oops! Something went wrong!");
};
exports.upload = multer({
    dest: __dirname + '/../../dist/uploads/temp/',
    limits: { fileSize: maxSize }
});
