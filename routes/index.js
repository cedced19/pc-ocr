var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');

/* GET home page rooter */
router.get('/', function(req, res, next) {
    res.redirect('/pc/' + randomstring.generate(7));
});

/* GET home page for computers */
router.get('/pc/:id', function(req, res, next) {
    res.locals.id = req.params.id;
    res.locals.address = req.app.get('address')
    res.render('index');
});

/* GET home page for mobile phones */
router.get('/phone/:id', function(req, res, next) {
    res.render('phone');
});

module.exports = router;
