var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");

describe("Boolean", function() {
  var swiftScript;
  beforeEach(function () {
    swiftScript = new SwiftScript();
  });

  it('should recognize true bool literal', function () {
    var input = "let trueBool = true;";
    var ast = swiftScript.astWithTypes(input);

    var bool = ast.scope.resolve("trueBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });

  it('should recognize false bool literal', function () {
    var input = "let falseBool = false;";
    var ast = swiftScript.astWithTypes(input);

    var bool = ast.scope.resolve("falseBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });

  it('should basic logical operators work', function () {
    var input = "let falseBool = 5 == 5;";
    var ast = swiftScript.astWithTypes(input);

    var bool = ast.scope.resolve("falseBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });
});