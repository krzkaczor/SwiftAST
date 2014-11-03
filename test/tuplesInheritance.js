var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAst/analyzer/errors.js");
var typeSystem = require("../SwiftAst/analyzer/typeSystem/typeSystem.js");
var SwiftAst = require("../SwiftAst/SwiftAst.js");
var path = require('path');

describe("Tuple inheritance model", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
  });

  it('should correctly recognize named tuple type', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "TuplesInheritance.swift"), "utf8");
    input += "getPoint((x: 5, y: 6));";

    var ast = swiftAst.ast(input);
  });

  it('should treat named tuple as subtype of tuple', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "TuplesInheritance.swift"), "utf8");
    input += "getPoint((5, 6));";

    var ast = swiftAst.ast(input);
  });

  it('should not allow to pass tuple with different names', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "TuplesInheritance.swift"), "utf8");
    input += "getPoint(a: 5, 6);";

    assert.throws( function() { return swiftAst.ast(input); }, errors.TypeInconsistencyError);
  });
});