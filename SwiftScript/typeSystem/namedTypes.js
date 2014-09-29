(function() {
  var NamedType = function(name, parent, concreteType) {
    this.CLASS = "NamedType";
    this.name = name;
    this.parent = parent;
    this.concreteType = concreteType;
  };

  var TypeRoot = require('./typeRoot.js');
  NamedType.prototype = new TypeRoot();

  NamedType.prototype.toString = function() {
    return this.concreteType? this.concreteType.toString() : this.name;
  };

  NamedType.prototype.ensureNotLiteral = function() {
    return this.concreteType || this;
  };

  NamedType.prototype.eq = function(other) {
    if (other.canUnpack)
      other = other.unpack();

    return this.name == other.name;
  };

  NamedType.prototype.isSubtype = function (other) {
    if (other.canUnpack)
      other = other.unpack();

    if (other == this || other == this.ensureNotLiteral())
      return true;
    if (this.parent)
      return this.parent.isSubtype(other);
    return false;
  };

  NamedType.prototype.findCommonType = function (anotherType) {
    var currentType = this;
    while (currentType !== undefined) {
      if (anotherType === currentType || anotherType.isSubtype(currentType))
        return currentType;
      else
        currentType = currentType.parent;
    }
  };

  module.exports = NamedType;
})();
