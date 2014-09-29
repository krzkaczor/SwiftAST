(function() {
  var TypeRoot = function() {
  };

  TypeRoot.prototype.ensureNotLiteral = function() {
    return this;
  };

  TypeRoot.prototype.inspect = function() {
    return this.toString();
  };

  module.exports = TypeRoot;
})();
