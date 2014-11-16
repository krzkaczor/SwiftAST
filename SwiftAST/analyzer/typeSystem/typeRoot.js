(function() {
  var TypeRoot = function() {
    this.CLASS = "TypeRoot";
  };

  TypeRoot.prototype.ensureNotLiteral = function() {
    return this;
  };

  TypeRoot.prototype.inspect = function() {
    return this.toString();
  };

  TypeRoot.prototype.eq = function (other) {
    return false;
  };

  TypeRoot.prototype.isSubtype = function (other) {
    return true;
  };

  module.exports = TypeRoot;
})();
