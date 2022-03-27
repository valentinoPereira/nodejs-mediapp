var express = require("express");
var router = express.Router();
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  const rootPath = path.join(__dirname, "..", "public");
  fs.readdir(path.join(rootPath, "images"), (err, files) => {
    res.render("index", { title: "My Image Gallery", files: files });
  });
});

router.get("/image/:imagename", function (req, res, next) {
  console.log("File: ", req.params.imagename);
  const rootPath = path.join(__dirname, "..", "public");
  const outputPath = path.join(
    rootPath,
    "cache",
    req.params.imagename + ".webp"
  );
  const inputImagePath = path.join(rootPath, "images", req.params.imagename);
  const width = req.query.width || 320;
  const height = req.query.height || 240;

  if (fs.existsSync(outputPath)) {
    res.sendFile(outputPath);
  } else if (fs.existsSync(inputImagePath)) {
    sharp(inputImagePath)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputPath, (err, info) => {
        console.error(err);
        if (err) res.status(500).send("Something went wrong!");
        console.log("Generated output file information: ", info);
        res.sendFile(outputPath);
      });
  } else {
    res.status(404).send("Image not found");
  }
});

module.exports = router;
