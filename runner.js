var util = require('util');
var fs = require("fs");

var input = fs.readFileSync("input.swift", "utf8");

console.log("INPUT:");
console.log(input);

var SwiftScript = require("./SwiftScript/swiftScript.js");
var swiftScript = new SwiftScript();
var ast = swiftScript.astWithTypes(input);

console.log("AST:");
ast.removeScopes();
console.log(util.inspect(ast, { depth: null }));

//var util = require('util');
//var fs = require("fs");
//var jison = require("jison");
//
//require("./SwiftScript/utils.js");
//var lexerHelper = require("./SwiftScript/lexer/lexerHelper.js").lexerHelper;
//var nodes       = require("./SwiftScript/models/nodes.js").nodes;
////var rewritter   = require("./SwiftScript/rewritter/rewritter.js");
//
//var lexer = fs.readFileSync("./SwiftScript/lexer/lexer.jisonlex", "utf8");
//lexer = lexer.replace(/return[ ]?o[ ]?\(/g, "return yy.lexerHelper.call(this,");
//
//var parser = fs.readFileSync("./SwiftScript/parser/parser.jison", "utf8");
//parser = parser.replace(/new[ ]?/g, "new yy.nodes.");
//
//var parser = new jison.Parser(lexer + parser);
//
//var input = fs.readFileSync("input.txt", "utf8");
//
//parser.yy.nodes = nodes;
//parser.yy.lexerHelper = lexerHelper;
//
//console.log("INPUT:");
//console.log(input);
//var ast = parser.parse(input);
//
//console.log("\nAST:");
//console.log(util.inspect(ast, { depth: null }));
//
//
//var translation = fs.readFileSync("./SwiftScript/rewritter/runtime.js", "utf8");
//console.log("\n\nTranslation:");

//console.log(translation);

//console.log("OUTPUT: ");
//eval(translation);