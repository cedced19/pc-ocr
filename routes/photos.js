var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var tika = require('tika');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../uploads/', req.body.type))
  },
  filename: function (req, file, cb) {
    cb(null, req.body.room)
  }
});

var upload = multer({ storage: storage });

/* POST upload new photo */
router.post('/', upload.single('file'), function(req, res, next) {
      res.json({
        status: 'ok'
      });
});

/* GET raw image */
router.get('/raw/:id', function (req, res, next) {
  var p = path.join(__dirname, '../uploads/raw', req.params.id);
  tika.type(p, function(err, result) {
    if (err) next(err);
    res.setHeader('Content-Type', result);
    fs.createReadStream(p).pipe(res);
  });
});

module.exports = router;
