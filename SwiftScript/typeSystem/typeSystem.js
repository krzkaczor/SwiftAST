(function () {
  var types = {
    NamedType: require("./namedTypes.js"),
    FunctionType: require("./functionType.js"),
    TupleType: require("./tupleType.js")
  };

  var builtInTypes = {
    "String": new types.NamedType("String"),
    "Bool": new types.NamedType("Bool"),
    "Double": new types.NamedType("Double"),
    "Int": new types.NamedType("Int")
  };

  builtInTypes.StringLiteral = new types.NamedType("StringLiteral", builtInTypes.String, builtInTypes.String);
  builtInTypes.BoolLiteral = new types.NamedType("BoolLiteral", builtInTypes.Bool, builtInTypes.Bool);
  builtInTypes.DoubleLiteral = new types.NamedType("DoubleLiteral", builtInTypes.Double, builtInTypes.Double);
  builtInTypes.IntLiteral = new types.NamedType("IntLiteral", builtInTypes.DoubleLiteral, builtInTypes.Int);

  module.exports = {
    types: types,
    builtInTypes: builtInTypes
  };
})();