var tabs = require('./tabs.js');
var fs = require('fs');
var js = tabs(fs.readFileSync('./test.t', 'utf8'));

//console.log(js);
eval(js);
