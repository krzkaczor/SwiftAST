(function() {
  var errors = require("../errors.js");
  var scopes = require("../scopes.js");
  var builtInTypes = require("./builtInTypes.js");
  var symbols = require("./symbols.js");

  var ArrayType = function (subtype) {
    this.CLASS = "ArrayType";
    this.accessible = true;

    this.subtype = subtype;
  };

  var TypeRoot = require('./typeRoot.js');
  ArrayType.prototype = new TypeRoot();

  ArrayType.prototype.access = function (id) {
    if (id == "count") {
      return new symbols.ConstantSymbol(id, builtInTypes.Int);
    }
    return new symbols.ConstantSymbol(id, this.subtype);
  };

  ArrayType.prototype.toString = function() {
    return 'Array [{0}]'.format(this.subtype.toString());
  };

  ArrayType.prototype.eq = function (other) {
    if (other.canUnpack)
      other = other.unpack();

    if (this.CLASS != other.CLASS)
      return false;

    return this.subtype.eq(other.subtype);
  };

  ArrayType.prototype.isSubtype = function (other) {
    if (other.canUnpack)
      other = other.unpack();

    if (this.CLASS != other.CLASS)
      return false;

    return this.subtype.isSubtype(other.subtype);
  };

  module.exports = ArrayType;
})();