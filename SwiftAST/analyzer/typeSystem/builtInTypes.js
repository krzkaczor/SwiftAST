(function() {
  var NamedType = require("./namedType.js");

  var builtInTypes = {
    "String": new NamedType("String"),
    "Bool": new NamedType("Bool"),
    "Double": new NamedType("Double"),
    "Int": new NamedType("Int")
  };

  builtInTypes.StringLiteral = new NamedType("StringLiteral", builtInTypes.String, builtInTypes.String);
  builtInTypes.BoolLiteral = new NamedType("BoolLiteral", builtInTypes.Bool, builtInTypes.Bool);
  builtInTypes.DoubleLiteral = new NamedType("DoubleLiteral", builtInTypes.Double, builtInTypes.Double);
  builtInTypes.IntLiteral = new NamedType("IntLiteral", builtInTypes.DoubleLiteral, builtInTypes.Int);

  module.exports = builtInTypes;
})()