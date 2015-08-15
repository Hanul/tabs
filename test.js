var tabs = require('./tabs.js');
var fs = require('fs');
var js = tabs(fs.readFileSync('./array.t', 'utf8'));

console.log(js);
eval(js);
