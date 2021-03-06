var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAST/analyzer/errors.js");
var SwiftAst = require("../SwiftAST/SwiftAst.js");
var path = require('path');

describe("TypeFill", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
  });

  it('should fill int types correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfIntDeclarations.swift"), "utf8");
    var ast = swiftAst.buildAstAndAnalyze(input);
    assert.equal(ast.statements[0].type.name, "Int");
    assert.equal(ast.statements[1].type.name, "Int");
    assert.equal(ast.statements[2].type.name, "Int");
  });

  it('should fill double types correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfDoubleDeclarations.swift"), "utf8");
    var ast = swiftAst.buildAstAndAnalyze(input);
    assert.equal(ast.statements[0].type.name, "Double");
    assert.equal(ast.statements[1].type.name, "Double");
    assert.equal(ast.statements[2].type.name, "Double");
    assert.equal(ast.statements[3].type.name, "Double");
    assert.equal(ast.statements[4].type.name, "Double");
  });

  it('should throw exception when declared type is different than actual one', function() {
    var input = "let intConst: Int = 5.5;";
    assert.throws( function() { return swiftAst.buildAstAndAnalyze(input); }, errors.TypeInconsistencyError);
  });

  it('should fill mixed types correctly', function() {
    var input = "let someVar = 1 + 1.0;";
    var ast = swiftAst.buildAstAndAnalyze(input);
    assert.equal(ast.statements[0].type.name, "Double");
  })


});