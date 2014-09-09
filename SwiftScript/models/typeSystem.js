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

  types.TypeSymbol = function(name, parent) {
    this.CLASS = "NamedTypeSymbol";
    this.name = name;
    this.parent = parent;
  };

  types.CompoundTypeSymbol = function(parent, child) {
    this.CLASS = "CompoundTypeSymbol";
    this.parent = parent;
    this.child = child;
  };

  types.TypeSymbol.prototype.ensureNotLiteral = function() {
    return this;
  };

  types.TypeSymbol.prototype.isSubtype = function (anotherType) {
    if (anotherType == this || anotherType == this.ensureNotLiteral())
      return true;
    if (this.parent)
      return this.parent.isSubtype(anotherType);
    return false;
  };

  types.TypeSymbol.prototype.findCommonType = function(anotherType) {
    var currentType = this;
    while(currentType !== undefined) {
      if (anotherType === currentType || anotherType.isSubtype(currentType))
        return currentType;
      else
        currentType = currentType.parent;
    }
  };

  var Double = new types.TypeSymbol("Double");

  var DoubleLiteral = new types.TypeSymbol("DoubleLiteral", Double);

  DoubleLiteral.ensureNotLiteral = function() {
    return builtInTypes.Double;
  };

  var IntegerLiteral = new types.TypeSymbol("IntegerLiteral", DoubleLiteral);

  IntegerLiteral.ensureNotLiteral = function() {
    return builtInTypes.Int;
  };

  var Integer = new types.TypeSymbol("Int");

  var FunctionType = function(params, returnType) {
    this.params = params;
    this.returnType = returnType;
  };

  FunctionType.prototype = new types.TypeSymbol("Function");

  var builtInTypes = {
    "Int": Integer,
    "Double": Double,
    "Array": new types.TypeSymbol("Array"),
    "IntegerLiteral": IntegerLiteral,
    "DoubleLiteral": DoubleLiteral
  };

  module.exports = {
    types: types,
    builtInTypes: builtInTypes
  };
})();