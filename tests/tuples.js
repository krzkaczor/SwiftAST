var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Tuples", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill type of tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var tupleType = ast.statements[0].type;
    assert.equal(tupleType.expressionsTypes[0].name, "Int");
    assert.equal(tupleType.expressionsTypes[1].name, "Double");
  });

  it('should deconstruct tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var scope = ast.statements[1].scope;
    assert.equal(scope.resolve("intConst").type.name, "Int");
    assert.equal(scope.resolve("doubleConst").type.name, "Double");
  });

  it('should deconstruct complex tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var scope = ast.statements[2].scope;
    assert.equal(scope.resolve("a").type.name, "Int");
    assert.equal(scope.resolve("b").type.name, "Double");
    assert.equal(scope.resolve("c").type.name, "Int");
  });

  it('should raise exception when deconstructing not tuple', function() {
    var input = "let (a, b) = 5.0;";

    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });
});