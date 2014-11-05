var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAST/analyzer/errors.js");
var typeSystem = require("../SwiftAST/analyzer/typeSystem/typeSystem.js");
var SwiftAst = require("../SwiftAST/SwiftAst.js");
var path = require('path');

describe("Scopes", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
  });

  it('should resolve different variables in different scopes', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "MultipleScopes.swift"), "utf8");
    var ast = swiftAst.ast(input);

    var globalScope = ast.scope;
    var func1Scope = ast.statements[0].block.scope;

    assert.ok(func1Scope.resolve('const').type.eq(typeSystem.builtInTypes.Int));
    assert.ok(globalScope.resolve('const').type.eq(typeSystem.builtInTypes.Double));
  });

  it('should built scopes correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "MultipleScopes.swift"), "utf8");
    var ast = swiftAst.ast(input);

    var globalScope = ast.scope;
    var func1Scope = ast.statements[0].block.scope;

    assert.ok(func1Scope.resolve('local').type.eq(typeSystem.builtInTypes.Int));
    assert.throws(function() {globalScope.resolve('local')} , errors.SymbolNotFoundError);
  });

  //@refactor - move
  it('should prevent from redeclaration of function', function() {
    var input = "func a () { return ; }\n";
    input += "func a () { return ; }\n";

    assert.throws(function() {swiftAst.ast(input);} , errors.SymbolRedeclarationError);
  });
});