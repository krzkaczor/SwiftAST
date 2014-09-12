var TypeInconsistencyError = function(types) {
  this.name = "TypeInconsistencyError";
  this.message = "Types inconsistency: " + types.map(function(type) {return type && type.name ? type.name : "Undefined" }).join(", ");
  this.types = types;
};

TypeInconsistencyError.prototype = new Error();

var SymbolNotFoundError = function(symbolName) {
  this.name = "SymbolNotFoundError";
  this.message = "Symbol not found: " + symbolName;
};

SymbolNotFoundError.prototype = new Error();

module.exports = {
  TypeInconsistencyError:  TypeInconsistencyError,
  SymbolNotFoundError:  SymbolNotFoundError
};