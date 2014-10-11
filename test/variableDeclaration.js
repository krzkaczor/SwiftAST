var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");

describe("VariableDeclaration", function() {
  var swiftScript;
  beforeEach(function () {
    swiftScript = new SwiftScript();
  });

  it('should declare variable', function () {
    var input = "var a = 5;";
    var ast = swiftScript.astWithTypes(input);

    assert.equal(ast.scope.resolve("a").CLASS, "VariableTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should allow to redeclare variable', function () {
    var input = "var a = 5;" +
      "a = 10;";
    var ast = swiftScript.astWithTypes(input);

    assert.equal(ast.scope.resolve("a").CLASS, "VariableTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should not allow to redeclare variable with another type', function () {
    var input = "var a = 5;" +
      "a = \"abc\";";

    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });
});