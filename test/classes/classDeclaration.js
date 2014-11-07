var assert = require("assert");
var fs = require("fs");
var errors = require("../SwiftAST/analyzer/errors.js");
var SwiftAst = require("../SwiftAST/SwiftAst.js");
var typeSystem = require("../SwiftAST/analyzer/typeSystem/typeSystem.js");
var path = require('path');

describe("ClassDeclaration", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
  });

  //it('should ', function() {
  //  var input = fs.readFileSync(path.join(__dirname, 'fixtures', 'BunchOfFunctions.swift'), "utf8");
  //  var ast = swiftAst.ast(input);
  //
  //  var returningIntFunctionSignature = ast.scope.resolve("returningIntFunction").type;
  //  assert.equal(returningIntFunctionSignature.paramType.expressionsTypes[0].name, "Int");
  //  assert.equal(returningIntFunctionSignature.returnType.name, "Int");
  //});
});