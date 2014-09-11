var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Functions", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill types of int function correctly', function() {
    var input = fs.readFileSync(path + "BunchOfFunctions.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    assert.equal(ast.statements[0].paramsTypes[0].name, "Int");
    assert.equal(ast.statements[0].returnType.name, "Int");
  });

  it('should fill types of double function correctly', function() {
    var input = fs.readFileSync(path + "BunchOfFunctions.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    assert.equal(ast.statements[1].paramsTypes[0].name, "Double");
    assert.equal(ast.statements[1].returnType.name, "Double");
  });

  it('should raise exception when arguments do not match function signature', function() {
    var input = fs.readFileSync(path + "BunchOfFunctions.swift", "utf8");
    input += "returningIntFunction(5.0);";
    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });

});