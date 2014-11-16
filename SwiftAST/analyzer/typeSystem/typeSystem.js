(function () {
  var types = {
    NamedType: require("./namedType.js")
  };

  types.FunctionType = require("./functionType.js");
  types.TupleType = require("./tupleType.js");
  types.ClassType = require("./classType.js");
  types.ArrayType = require("./arrayType.js");
  types.TypeRoot = require("./typeRoot.js");

  module.exports = {
    types: types,
    builtInTypes: require("./builtInTypes")
  };
})();