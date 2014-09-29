var util = require('util');
var fs = require("fs");

var input = fs.readFileSync("input.swift", "utf8");

console.log("INPUT:");
console.log(input);

var SwiftScript = require("./SwiftScript/swiftScript.js");
var swiftScript = new SwiftScript();
var ast = swiftScript.astWithTypes(input);

if (ast) {
  console.log("AST:");
  ast.removeScopes();
  console.log(util.inspect(ast, { depth: null }));
}