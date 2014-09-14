(function() {
  var NamedType = function(name, parent) {
    this.CLASS = "NamedType";
    this.name = name;
    this.parent = parent;
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

  module.exports = NamedType;
})();
