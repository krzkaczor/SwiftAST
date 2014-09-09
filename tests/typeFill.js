var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("TypeFill", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill int types correctly', function() {
    var input = fs.readFileSync(path + "BunchOfIntDeclarations.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    assert.equal(ast.statements[0].type.name, "Int");
    assert.equal(ast.statements[1].type.name, "Int");
    assert.equal(ast.statements[2].type.name, "Int");
  });

  it('should fill double types correctly', function() {
    var input = fs.readFileSync(path + "BunchOfDoubleDeclarations.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    assert.equal(ast.statements[0].type.name, "Double");
    assert.equal(ast.statements[1].type.name, "Double");
    assert.equal(ast.statements[2].type.name, "Double");
    assert.equal(ast.statements[3].type.name, "Double");
    assert.equal(ast.statements[4].type.name, "Double");
  });

  it('should throw exception when declared type is different than actual one', function() {
    var input = "let intConst: Int = 5.5;";
    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });

  it('should fill mixed types correctly', function() {
    var input = "let someVar = 1 + 1.0";
    var ast = swiftScript.astWithTypes(input);
    assert.equal(ast.statements[0].type.name, "Double");
  })


});