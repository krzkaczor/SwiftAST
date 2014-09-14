(function() {
  var typeSystem = require('./typeSystem.js');
  var errors = require('./errors.js');
  var util = require('util');

  var Scope = function() {
    this.symbols = {};
  };

  Scope.prototype.inspect = function() {
    return util.inspect(this.symbols, {depth: 2});
  };

  Scope.prototype.define = function(name, type) {
    this.symbols[name] = type;
  };

  Scope.prototype.defineFunction = function(name, type) {
    this.symbols[name] = new typeSystem.types.ConstantSymbol(name, type); //todo
  };

  Scope.prototype.defineConstant = function(name, type) {
    this.symbols[name] = new typeSystem.types.ConstantSymbol(name, type);
  };

  Scope.prototype.resolve = function(name) {
    var searchedSymbol = this.symbols[name];

    if (searchedSymbol)
      return searchedSymbol;

    if (this.parent)
      return this.parent.resolve(name);

    throw new errors.SymbolNotFoundError(name);
  };

  var scopes = {};

  scopes.LocalScope = function(parent) {
    this.parent = parent;
  };

  scopes.LocalScope.prototype = new Scope();

  scopes.RootScope = function() {
    this.loadBuiltInTypes();
  };

  scopes.RootScope.prototype = new Scope();

  scopes.RootScope.prototype.loadBuiltInTypes = function() {
    var self = this;
    for(var typeName in typeSystem.builtInTypes) {
      if (!typeSystem.builtInTypes.hasOwnProperty(typeName))
        continue;
      self.symbols[typeName] = typeSystem.builtInTypes[typeName];
    }
  };

  module.exports = scopes;
})();