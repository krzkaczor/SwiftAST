var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Tuples", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should fill type of tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var tupleType = ast.statements[0].type;
    assert.equal(tupleType.expressionsTypes[0].name, "Int");
    assert.equal(tupleType.expressionsTypes[1].name, "Double");
  });

  it('should deconstruct tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var scope = ast.statements[1].scope;
    assert.equal(scope.resolve("intConst").type.name, "Int");
    assert.equal(scope.resolve("doubleConst").type.name, "Double");
  });

  it('should deconstruct complex tuple', function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var scope = ast.statements[2].scope;
    assert.equal(scope.resolve("a").type.name, "Int");
    assert.equal(scope.resolve("b").type.name, "Double");
    assert.equal(scope.resolve("c").type.name, "Int");
  });

  it('should raise exception when deconstructing not tuple', function() {
    var input = "let (a, b) = 5.0;";

    assert.throws( function() { return swiftScript.astWithTypes(input); }, errors.TypeInconsistencyError);
  });

  it("should work with type annotation", function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    var intAndInt = globalScope.resolve("intAndInt");
    assert.equal(intAndInt.type.CLASS, "TupleType");
    assert.equal(intAndInt.type.expressionsTypes[0].eq(typeSystem.builtInTypes.Int), true);
    assert.equal(intAndInt.type.expressionsTypes[1].eq(typeSystem.builtInTypes.Int), true);
  });

  it("should treat single-element-tuple as named type", function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    var intAndInt = globalScope.resolve("singleTuple");
    assert.ok(intAndInt.type.eq(typeSystem.builtInTypes.Double));
  });

  it("should treat single-element-tuple explicit typed as named type", function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    var intAndInt = globalScope.resolve("singleTupleExplicitTyped");
    assert.ok(intAndInt.type.eq(typeSystem.builtInTypes.Double));
  });

  it("should be covariant", function() {
    var input = "let doubleTuple: (Double, Double) = (5, 5);";
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    var anotherType = new typeSystem.types.TupleType([typeSystem.builtInTypes.Double, typeSystem.builtInTypes.Double]);
    assert.ok(globalScope.resolve("doubleTuple").type.eq(anotherType));
  });

  it("should allow access a member", function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    assert.ok(globalScope.resolve("intConst2").type.eq(typeSystem.builtInTypes.Int));
    assert.ok(globalScope.resolve("doubleConst2").type.eq(typeSystem.builtInTypes.Double));
  });

  it("should allow access a member by id", function() {
    var input = fs.readFileSync(path + "BunchOfTuples.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
    var globalScope = ast.scope;

    var namedTuple = globalScope.resolve("namedTuple").type;
    assert.ok(namedTuple.access("x").eq(typeSystem.builtInTypes.Int));
    assert.ok(namedTuple.access("y").eq(typeSystem.builtInTypes.Double));
  });
});