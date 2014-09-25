(function() {
  var TypeRoot = function() {
  };

  TypeRoot.prototype.ensureNotLiteral = function() {
    return this;
  };

  module.exports = TypeRoot;
})();
