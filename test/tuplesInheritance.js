var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Tuple inheritance model", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should correctly recognize named tuple type', function() {
    var input = fs.readFileSync(path + "TuplesInheritance.swift", "utf8");
    input += "getPoint((x: 5, y: 6));";

    var ast = swiftScript.astWithTypes(input);
  });

  it('should treat named tuple as subtype of tuple', function() {
    var input = fs.readFileSync(path + "TuplesInheritance.swift", "utf8");
    input += "getPoint((5, 6));";

    var ast = swiftScript.astWithTypes(input);
  });

  it('should not allow to pass tuple with different names', function() {
    var input = fs.readFileSync(path + "TuplesInheritance.swift", "utf8");
    input += "getPoint(a: 5, 6);";

    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });
});