var TypeInconsistencyError = function(types) {
  this.CLASS = "TypeInconsistencyError";
  this.message = "Types inconsistency: " + types.map(function(type) {return type && type.CLASS ? type.CLASS : "Undefined" }).join(", ");
  this.types = types;
};
TypeInconsistencyError.prototype = new Error();


var SymbolNotFoundError = function(name) {
  this.CLASS = "SymbolNotFoundError";
  this.name = name;
  this.message = "Symbol not found: " + name;
};
SymbolNotFoundError.prototype = new Error();

var InternalError = function(description) {
  this.CLASS = "InternalError";
  this.description = description;
  this.message = "Internal Error: " + description;
};
InternalError.prototype = new Error();

var TypeNotAccessibleError = function(type) {
  this.CLASS = "TypeNotAccessibleError";
  this.type = type;
  this.message = "Type is not accessible: " + type.CLASS;
};
TypeNotAccessibleError.prototype = new Error();


var SymbolRedeclarationError = function(name) {
  this.CLASS = 'SymbolRedeclarationError';
  this.name = name;
  this.message = "Symbol redeclaration: " + name;
};
SymbolRedeclarationError.prototype = new Error();

var ConstantAssignmentError = function(name) {
  this.CLASS = 'ConstantAssignmentError';
  this.name = name;
  this.message = "Trying to assign to constant: " + name;
};
ConstantAssignmentError.prototype = new Error();


module.exports = {
  TypeNotAccessibleError: TypeNotAccessibleError,
  TypeInconsistencyError: TypeInconsistencyError,
  SymbolNotFoundError: SymbolNotFoundError,
  SymbolRedeclarationError: SymbolRedeclarationError,
  ConstantAssignmentError: ConstantAssignmentError
};