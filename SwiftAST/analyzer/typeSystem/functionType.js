(function() {
  var FunctionType = function (paramsTypes, returnType) {
    this.CLASS = "FunctionType";
    this.paramType = paramsTypes;
    this.returnType = returnType;
  };

  var TypeRoot = require('./typeRoot.js');
  FunctionType.prototype = new TypeRoot();

  FunctionType.prototype.toString = function() {
    return "Function {0} -> {1}".format(this.paramType, this.returnType);
  };

  FunctionType.prototype.eq = function (other) {
    if (other.canUnpack)
      other = other.unpack();

    if (this.CLASS != other.CLASS)
      return false;

    return this.paramType.eq(other.paramType) && this.returnType.eq(other.returnType);
  };

  FunctionType.prototype.isSubtype = function (other) {
    return false; //for now don't care about function covariance
  };

  module.exports = FunctionType;
})();