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

  types.NamedType = function(name, parent) {
    this.CLASS = "NamedType";
    this.name = name;
    this.parent = parent;
  };

  types.NamedType.prototype.eq = function(other) {
    if (other.canUnpack)
      other = other.unpack();

    return this.name == other.name;
  };

  types.NamedType.prototype.isSubtype = function (other) {
    if (other.canUnpack)
      other = other.unpack();

    if (other == this || other == this.ensureNotLiteral())
      return true;
    if (this.parent)
      return this.parent.isSubtype(other);
    return false;
  };

  types.FunctionType = function(paramsTypes, returnType) {
    this.CLASS = "FunctionType";
    this.paramType = paramsTypes;
    this.returnType = returnType;
  };

  types.FunctionType.prototype.eq = function(other) {
    if (other.canUnpack)
      other = other.unpack();

    if (this.CLASS != other.CLASS)
      return false;

    return this.paramType.eq(other.paramType) && this.returnType.eq(other.returnType);
  };

  types.FunctionType.prototype.isSubtype = function(other) {
    return false; //for now don't care about function covariance
  };

  types.TupleType = function(expressionsTypes) {
    this.CLASS = "TupleType";
    this.expressionsTypes = expressionsTypes;
    this.canUnpack = this.expressionsTypes.length == 1;
    this.accessible = true;
  };

  types.TupleType.prototype.unpack = function() {
    return this.expressionsTypes[0];
  };

  types.TupleType.prototype.access = function(id) {
    return this.expressionsTypes[id];
  };

  types.TupleType.prototype.eq = function(other) {
    if (this.expressionsTypes.length == 1)
      return other.eq(this.expressionsTypes[0]);

    if (this.CLASS != other.CLASS || this.expressionsTypes.length != other.expressionsTypes.length)
      return false;

    for(var i = 0; i < this.expressionsTypes.length; i++) {
      if (!this.expressionsTypes[i].eq(other.expressionsTypes[i]))
        return false;
    }
    return true;
  };

  types.TupleType.prototype.isSubtype = function(other) {
    if (this.expressionsTypes.length == 1) {
      return this.unpack().isSubtype(other);
    }

    if (this.CLASS != other.CLASS || this.expressionsTypes.length != other.expressionsTypes.length)
      return false;

    for(var i = 0; i < this.expressionsTypes.length; i++) {
      if (!this.expressionsTypes[i].isSubtype(other.expressionsTypes[i]))
        return false;
    }
    return true;
  };

  types.TupleType.prototype.ensureNotLiteral = types.NamedType.prototype.ensureNotLiteral = function() {
    return this;
  };

  types.NamedType.prototype.findCommonType = function(anotherType) {
    var currentType = this;
    while(currentType !== undefined) {
      if (anotherType === currentType || anotherType.isSubtype(currentType))
        return currentType;
      else
        currentType = currentType.parent;
    }
  };

  var Double = new types.NamedType("Double");

  var DoubleLiteral = new types.NamedType("DoubleLiteral", Double);

  DoubleLiteral.ensureNotLiteral = function() {
    return builtInTypes.Double;
  };

  var IntegerLiteral = new types.NamedType("IntegerLiteral", DoubleLiteral);

  IntegerLiteral.ensureNotLiteral = function() {
    return builtInTypes.Int;
  };

  var Integer = new types.NamedType("Int");

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