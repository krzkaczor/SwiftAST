var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAST/analyzer/errors.js");
var SwiftAst = require("../SwiftAST/SwiftAst.js");
var typeSystem = require("../SwiftAST/analyzer/typeSystem/typeSystem.js");

describe("VariableDeclaration", function() {
  var swiftAst;
  beforeEach(function () {
    swiftAst = new SwiftAst();
  });

  it('should declare variable', function () {
    var input = "var a = 5;";
    var ast = swiftAst.buildAstAndAnalyze(input);

    assert.equal(ast.scope.resolve("a").CLASS, "VariableTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should allow to redeclare variable', function () {
    var input = "var a = 5;" +
      "a = 10;";
    var ast = swiftAst.buildAstAndAnalyze(input);

    assert.equal(ast.scope.resolve("a").CLASS, "VariableTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should not allow to redeclare variable with another type', function () {
    var input = "var a = 5;" +
      "a = \"abc\";";

    assert.throws( function() { return swiftAst.buildAstAndAnalyze(input); }, errors.TypeInconsistencyError);
  });
});