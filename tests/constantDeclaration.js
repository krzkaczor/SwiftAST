var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");

describe("ConstantDeclaration", function() {
  var swiftScript;
  beforeEach(function () {
    swiftScript = new SwiftScript();
  });

  it('should declare constant', function () {
    var input = "let a = 5;";
    var ast = swiftScript.astWithTypes(input);

    assert.equal(ast.scope.resolve("a").CLASS, "ConstantTypeSymbol");
    assert.equal(ast.scope.resolve("a").type, typeSystem.builtInTypes.Int);
  });

  it('should prevent from redeclaration of const', function() {
    var input = "let a = 5;";
    input += "let a = 5.5;";

    assert.throws(function() {swiftScript.astWithTypes(input);} , errors.SymbolRedeclarationError);
  });

  it('should hide previously declared const', function() {
    var input = "let a = 5;\n" +
      "func fun () {\n" +
      "let a = 5.5;\n" +
      "}\n";

    swiftScript.astWithTypes(input);
  });

  it('should not allow assigning to const', function() {
    var input = "let a = 5;";
    input += "a = 6;";

    assert.throws(function() {swiftScript.astWithTypes(input);} , errors.ConstantAssignmentError);
  });
});