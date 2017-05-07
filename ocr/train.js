var dv = require('ndv');
var fs = require('fs');
var image = new dv.Image('png', fs.readFileSync(__dirname + '/textpage300.png'));
var tesseract = new dv.Tesseract('eng', image);
console.log(tesseract.findText('plain'));
