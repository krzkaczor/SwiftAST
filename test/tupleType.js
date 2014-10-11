var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("TupleType", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should be equal to simpler type when consists only of one element', function() {
    var intTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.Int]);

    assert.ok(intTuple.eq(typeSystem.builtInTypes.Int));
  });

  it('should simpler type be equal to tupleType when consists only of one element', function() {
    var intTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.Int]);

    assert.ok(typeSystem.builtInTypes.Int.eq(intTuple));
  });

  it('should be equal to itself', function() {
    var intTupleType = new typeSystem.types.TupleType([typeSystem.builtInTypes.Int]);

    assert.ok(intTupleType.eq(intTupleType));
  });

  it('should be covariant', function() {
    var doublesTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.Double, typeSystem.builtInTypes.Double]);
    var intLiteralsTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.IntLiteral, typeSystem.builtInTypes.IntLiteral]);
    assert.ok(intLiteralsTuple.isSubtype(doublesTuple));
  });

  it('should be not equal to different tupple', function() {
    var doublesTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.Double, typeSystem.builtInTypes.Double]);
    var intLiteralsTuple = new typeSystem.types.TupleType([typeSystem.builtInTypes.Int, typeSystem.builtInTypes.Int]);
    assert.ok(!doublesTuple.eq(intLiteralsTuple));
  });
});