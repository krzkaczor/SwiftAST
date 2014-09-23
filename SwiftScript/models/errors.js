var TypeInconsistencyError = function(types) {
  this.name = "TypeInconsistencyError";
  this.message = "Types inconsistency: " + types.map(function(type) {return type && type.CLASS ? type.CLASS : "Undefined" }).join(", ");
  this.types = types;
};

TypeInconsistencyError.prototype = new Error();

var SymbolNotFoundError = function(symbolName) {
  this.name = "SymbolNotFoundError";
  this.message = "Symbol not found: " + symbolName;
};

SymbolNotFoundError.prototype = new Error();

var TypeNotAccessibleError = function(type) {
  this.type = type;
  this.name = "TypeNotAccessibleError";
  this.message = "Type is not accessible: " + type.CLASS;
};

TypeNotAccessibleError.prototype = new Error();

module.exports = {
  TypeInconsistencyError: TypeInconsistencyError,
  SymbolNotFoundError: SymbolNotFoundError,
  TypeNotAccessibleError: TypeNotAccessibleError
};