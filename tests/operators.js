var assert = require("assert");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Operators", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  //CHECK IT
  it('should associate correctly', function() {
    var input = "let a = 1 + 2 + 3;";
    var ast = swiftScript.astWithTypes(input);
    assert.equal(ast.statements[0].type.name, "Int");
    assert.equal(ast.statements[0].expression.left.left.value, 1);
    assert.equal(ast.statements[0].expression.left.right.value, 2);
    assert.equal(ast.statements[0].expression.right.value, 3);
  });

//  it('should work with precedence', function() {
//    var input = fs.readFileSync(path + "BunchOfDoubleDeclarations.swift", "utf8");
//    var ast = swiftScript.astWithTypes(input);
//    assert.equal(ast.statements[4].type.name, "Double");
//  });

});