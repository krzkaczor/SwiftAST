(function() {
  var scopes = require("../models/scopes.js");

  var types = {};

  types.NamedType = require("./namedTypes.js");

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

  types.FunctionType.prototype.ensureNotLiteral = function() {
    return this;
  };

  types.TupleType = function(expressionsTypes, ids) {
    this.CLASS = "TupleType";
    this.expressionsTypes = expressionsTypes === undefined ? [] : expressionsTypes;
    this.canUnpack = this.expressionsTypes.length == 1;
    this.accessible = true;
    this.ids = ids;

    this.scope = new scopes.RootScope();

    var self = this;
    this.expressionsTypes.forEach(function(type, i) {
      self.scope.defineConstant(i, type);
      //has additional id
      if (ids && ids[i]) {
        self.scope.defineConstant(ids[i].value, type);
      }
    });
    };

  types.TupleType.prototype.unpack = function() {
    return this.expressionsTypes[0];
  };

  types.TupleType.prototype.access = function(id) {
    return this.scope.resolve(id).type;
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

  types.TupleType.prototype.ensureNotLiteral = function() {
    var notLiteralTypes = this.expressionsTypes.map(function(type) {
      return type.ensureNotLiteral();
    });

    return new types.TupleType(notLiteralTypes, this.ids);
  };

  types.NamedType.prototype.ensureNotLiteral = function() {
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

  var String = new types.NamedType("String");
  var StringLiteral = new types.NamedType("StringLiteral", String);
  StringLiteral.ensureNotLiteral = function() {
    return builtInTypes.String;
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
    "String": String,
    "Int": Integer,
    "Double": Double,
    "StringLiteral": StringLiteral,
    "IntegerLiteral": IntegerLiteral,
    "DoubleLiteral": DoubleLiteral
  };

  module.exports = {
    types: types,
    builtInTypes: builtInTypes
  };
})();