var TypeInconsistencyError = function(types) {
  this.name = "TypeInconsistencyError";
  this.message = "Types inconsistency: " + types.map(function(type) {return type.name}).join(", ");
  this.types = types;
};

TypeInconsistencyError.prototype = new Error();

module.exports = {
  TypeInconsistencyError:  TypeInconsistencyError
};