var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var typeSystem = require("../SwiftScript/models/typeSystem.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Scopes", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should resolve different variables in different scopes', function() {
    var input = fs.readFileSync(path + "MultipleScopes.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var globalScope = ast.scope;
    var func1Scope = ast.statements[0].block.scope;

    assert.ok(func1Scope.resolve('const').type.eq(typeSystem.builtInTypes.Int));
    assert.ok(globalScope.resolve('const').type.eq(typeSystem.builtInTypes.Double));
  });

  it('should built scopes correctly', function() {
    var input = fs.readFileSync(path + "MultipleScopes.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var globalScope = ast.scope;
    var func1Scope = ast.statements[0].block.scope;

    assert.ok(func1Scope.resolve('local').type.eq(typeSystem.builtInTypes.Int));
    assert.throws(function() {globalScope.resolve('local')} , errors.SymbolNotFoundError);
  });
});