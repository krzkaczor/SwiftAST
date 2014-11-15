var assert = require("assert");
var SwiftAst = require("../SwiftAST/SwiftAst.js");

describe("Operators", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
  });

  //CHECK IT
  it('should associate correctly', function() {
    var input = "let a = 1 + 2 + 3;";
    var ast = swiftAst.buildAstAndAnalyze(input);
    assert.equal(ast.statements[0].type.name, "Int");
    assert.equal(ast.statements[0].expression.left.left.value, 1);
    assert.equal(ast.statements[0].expression.left.right.value, 2);
    assert.equal(ast.statements[0].expression.right.value, 3);
  });

//  it('should work with precedence', function() {
//    var input = fs.readFileSync(path + "BunchOfDoubleDeclarations.swift", "utf8");
//    var buildAstAndAnalyze = swiftAst.buildAstAndAnalyze(input);
//    assert.equal(buildAstAndAnalyze.statements[4].type.name, "Double");
//  });

});