var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAst/analyzer/errors.js");
var SwiftScript = require("../SwiftAst/SwiftAst.js");
var path = require('path');

describe("TypeFill", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill int types correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfIntDeclarations.swift"), "utf8");
    var ast = swiftScript.ast(input);
    assert.equal(ast.statements[0].type.name, "Int");
    assert.equal(ast.statements[1].type.name, "Int");
    assert.equal(ast.statements[2].type.name, "Int");
  });

  it('should fill double types correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfDoubleDeclarations.swift"), "utf8");
    var ast = swiftScript.ast(input);
    assert.equal(ast.statements[0].type.name, "Double");
    assert.equal(ast.statements[1].type.name, "Double");
    assert.equal(ast.statements[2].type.name, "Double");
    assert.equal(ast.statements[3].type.name, "Double");
    assert.equal(ast.statements[4].type.name, "Double");
  });

  it('should throw exception when declared type is different than actual one', function() {
    var input = "let intConst: Int = 5.5;";
    assert.throws( function() { return swiftScript.ast(input); }, errors.TypeInconsistencyError);
  });

  it('should fill mixed types correctly', function() {
    var input = "let someVar = 1 + 1.0;";
    var ast = swiftScript.ast(input);
    assert.equal(ast.statements[0].type.name, "Double");
  })


});