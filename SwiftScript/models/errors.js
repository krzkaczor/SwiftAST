var TypeInconsistencyError = function(types) {
  this.name = "TypeInconsistencyError";
  this.message = "Types inconsistency: " + types.map(function(type) {return type && type.name ? type.name : "Undefined" }).join(", ");
  this.types = types;
};

TypeInconsistencyError.prototype = new Error();

module.exports = {
  TypeInconsistencyError:  TypeInconsistencyError
};