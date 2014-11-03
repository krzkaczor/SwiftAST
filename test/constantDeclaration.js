var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAst/analyzer/errors");
var SwiftAst = require("../SwiftAst/SwiftAst.js");
var typeSystem = require("../SwiftAst/analyzer/typeSystem/typeSystem.js");

describe("ConstantDeclaration", function() {
  var swiftAst;
  beforeEach(function () {
    swiftAst = new SwiftAst();
  });

  it('should declare constant', function () {
    var input = "let a = 5;";
    var ast = swiftAst.ast(input);

    assert.equal(ast.scope.resolve("a").CLASS, "ConstantTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should prevent from redeclaration of const', function() {
    var input = "let a = 5;";
    input += "let a = 5.5;";

    assert.throws(function() {swiftAst.ast(input);} , errors.SymbolRedeclarationError);
  });

  it('should hide previously declared const', function() {
    var input = "let a = 5;\n" +
      "func fun () {\n" +
      "let a = 5.5;\n" +
      "}\n";

    swiftAst.ast(input);
  });

  it('should not allow assigning to const', function() {
    var input = "let a = 5;";
    input += "a = 6;";

    assert.throws(function() {swiftAst.ast(input);} , errors.ConstantAssignmentError);
  });
});