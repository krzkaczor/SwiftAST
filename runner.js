var util = require('util');
var fs = require("fs");

var input = fs.readFileSync('./input.swift', {encoding: 'utf8'});
console.log("INPUT:");
console.log(input);

var SwiftAst = require("./SwiftAst/SwiftAst.js");
var swiftAst = new SwiftAst();
var ast = swiftAst.ast(input);

if (ast) {
  console.log("AST:");
  ast.removeScopes();
  console.log(util.inspect(ast, { depth: null }));
}