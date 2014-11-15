(function() {
  var ExternalType = function () {
    this.CLASS = "ExternalType";
  };

  var TypeRoot = require('./typeRoot.js');
  ExternalType.prototype = new TypeRoot();

  ExternalType.prototype.toString = function() {
    return "EXTERNAL"''
  };

  ExternalType.prototype.eq = function (other) {
    return true;
  };

  ExternalType.prototype.isSubtype = function (other) {
    return true;
  };

  module.exports = ExternalType;
})();