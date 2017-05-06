var express = require('express');
var router = express.Router();
var QRCode = require('qr-image');


/* GET home page rooter */
router.get('/:id', function(req, res, next) {
  try {
    var img = QRCode.image(req.app.get('address') + '/phone/' + req.params.id, { type: 'png', ec_level: 'H' });
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
