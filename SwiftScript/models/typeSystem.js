(function() {
  var types = {};

  types.VariableSymbol = function(name, type) {
    this.name = name;
    this.type = type;
  };

  types.ConstantSymbol = function(name, type) {
    this.CLASS = "ConstantTypeSymbol";
    this.name = name;
    this.type = type;
  };

  types.NamedTypeSymbol = function(name, parent) {
    this.CLASS = "NamedTypeSymbol";
    this.name = name;
    this.parent = parent;
  };

  types.NamedTypeSymbol.prototype.eq = function(other) {
    return this == other;
  };

  types.FunctionType = function(paramsTypes, returnType) {
    this.CLASS = "FunctionTypeSymbol";
    this.paramsTypes = paramsTypes;
    this.returnType = returnType;
  };

  types.TupleType = function(expressionsTypes) {
    this.expressionsTypes = expressionsTypes;
  };

  types.TupleType.prototype.ensureNotLiteral = types.NamedTypeSymbol.prototype.ensureNotLiteral = function() {
    return this;
  };

  types.NamedTypeSymbol.prototype.isSubtype = function (anotherType) {
    if (anotherType == this || anotherType == this.ensureNotLiteral())
      return true;
    if (this.parent)
      return this.parent.isSubtype(anotherType);
    return false;
  };

  types.NamedTypeSymbol.prototype.findCommonType = function(anotherType) {
    var currentType = this;
    while(currentType !== undefined) {
      if (anotherType === currentType || anotherType.isSubtype(currentType))
        return currentType;
      else
        currentType = currentType.parent;
    }
  };

  var Double = new types.NamedTypeSymbol("Double");

  var DoubleLiteral = new types.NamedTypeSymbol("DoubleLiteral", Double);

  DoubleLiteral.ensureNotLiteral = function() {
    return builtInTypes.Double;
  };

  var IntegerLiteral = new types.NamedTypeSymbol("IntegerLiteral", DoubleLiteral);

  IntegerLiteral.ensureNotLiteral = function() {
    return builtInTypes.Int;
  };

  var Integer = new types.NamedTypeSymbol("Int");

  var builtInTypes = {
    "Int": Integer,
    "Double": Double,
    "IntegerLiteral": IntegerLiteral,
    "DoubleLiteral": DoubleLiteral
  };

  module.exports = {
    types: types,
    builtInTypes: builtInTypes
  };
})();