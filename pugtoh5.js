var fs = require('fs');
var pug = require('pug');
var jsFunctionString = pug.compileFileClient('index.pug', {name: "fancyTemplateFun"});
var fn = pug.compileFile('index.pug');
var html = fn();
fs.writeFileSync("templates.js", jsFunctionString);
fs.writeFileSync("indexbypug.html", html);