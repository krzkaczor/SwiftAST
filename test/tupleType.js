var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAst/analyzer/errors.js");
var typeSystem = require("../SwiftAst/analyzer/typeSystem/typeSystem.js");
var SwiftAst = require("../SwiftAst/SwiftAst.js");

describe("TupleType", function() {
  var swiftAst;
  beforeEach(function() {
    swiftAst = new SwiftAst();
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