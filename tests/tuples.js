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

});