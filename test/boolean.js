var assert = require("assert");
var fs = require("fs");
var SwiftAst = require("../SwiftAST/SwiftAst");
var errors = require("../SwiftAST/analyzer/errors");
var typeSystem = require("../SwiftAST/analyzer/typeSystem/typeSystem");

describe("Boolean", function() {
  var swiftAst;
  beforeEach(function () {
    swiftAst = new SwiftAst();
  });

  it('should recognize true bool literal', function () {
    var input = "let trueBool = true;";
    var ast = swiftAst.buildAstAndAnalyze(input);

    var bool = ast.scope.resolve("trueBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });

  it('should recognize false bool literal', function () {
    var input = "let falseBool = false;";
    var ast = swiftAst.buildAstAndAnalyze(input);

    var bool = ast.scope.resolve("falseBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });

  it('should basic logical operators work', function () {
    var input = "let falseBool = 5 == 5;";
    var ast = swiftAst.buildAstAndAnalyze(input);

    var bool = ast.scope.resolve("falseBool").type;
    assert.ok(bool.eq(typeSystem.builtInTypes.Bool));
  });
});