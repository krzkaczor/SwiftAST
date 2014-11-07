(function() {
  var errors = require("../errors.js");
  var scopes = require("../scopes.js");

  var ClassType = function (name, scope) {
    this.CLASS = "ClassType";
    this.name = name;
    this.accessible = true;

    this.scope = new scopes.WrapScope(scope);
  };

  var TypeRoot = require('./typeRoot.js');
  ClassType.prototype = new TypeRoot();

  ClassType.prototype.access = function (id) {
    return this.scope.resolve(id);
  };

  ClassType.prototype.toString = function() {
    return 'Class {0}'.format(this.name);
  };

  module.exports = ClassType;
})();