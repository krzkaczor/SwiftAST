var assert = require("assert");
var fs = require("fs");
var errors = require("../SwiftAst/analyzer/errors.js");
var SwiftScript = require("../SwiftAst/SwiftAst.js");
var typeSystem = require("../SwiftAst/analyzer/typeSystem/typeSystem.js");
var path = require('path');

describe("Functions", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill types of int function correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', 'BunchOfFunctions.swift'), "utf8");
    var ast = swiftScript.ast(input);

    var returningIntFunctionSignature = ast.scope.resolve("returningIntFunction").type;
    assert.equal(returningIntFunctionSignature.paramType.expressionsTypes[0].name, "Int");
    assert.equal(returningIntFunctionSignature.returnType.name, "Int");
  });

  it('should fill types of double function correctly', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    var ast = swiftScript.ast(input);

    var returningIntFunctionSignature = ast.scope.resolve("returningDoubleFunction").type;
    assert.equal(returningIntFunctionSignature.paramType.expressionsTypes[0].name, "Double");
    assert.equal(returningIntFunctionSignature.returnType.name, "Double");
  });

  it('should raise exception when arguments do not match function signature', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    input += "returningIntFunction(5.0);";
    assert.throws( function() { return swiftScript.ast(input); }, errors.TypeInconsistencyError);
  });

  it('should allow function as first class citizens', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    var ast = swiftScript.ast(input);

    var scope = ast.scope;
    var applyZero = scope.resolve("applyZero").type;
    assert.equal(applyZero.returnType.name, "Int");
    assert.equal(applyZero.paramType.expressionsTypes[0].CLASS, "FunctionType");
  });

  it('should allow function without parameters', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    input += "let funcThatTakesOneArg: () -> Int = returnFive;";
    var ast = swiftScript.ast(input);

    var scope = ast.scope;
    var returnFive = scope.resolve("returnFive").type;
    assert.equal(returnFive.returnType.eq(typeSystem.builtInTypes.Int), true);
  });

  it('should allow function without parameters', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    var ast = swiftScript.ast(input);

    var scope = ast.scope;
    var doNothing = scope.resolve("doNothing").type;
    var doNothing2 = scope.resolve("doNothing2").type;
    assert.equal(doNothing.eq(doNothing2), true);
    assert.equal(doNothing.returnType.eq(new typeSystem.types.TupleType()), true);
  });

  it('should enforce using named parameters when declared', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfFunctions.swift"), "utf8");
    input += 'namedParameters(a: 5, 10);';

    assert.throws(function() { swiftScript.ast(input); }, errors.TypeInconsistencyError);
  });
});