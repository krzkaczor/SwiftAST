(function() {
  var typeSystem = require('./typeSystem.js');
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

  Scope.prototype.defineConstant = function(name, type) {
    this.symbols[name] = new typeSystem.types.ConstantSymbol(name, type);
  };

  Scope.prototype.resolve = function(name) {
    var searchedSymbol = this.symbols[name];

    if(searchedSymbol === undefined)
      return this.parent ? this.parent.resolve(name) : undefined;
    else
      return searchedSymbol;
  };

  var scopes = {};

  scopes.LocalScope = function(parent) {
    var localScope = Object.create(new Scope());
    localScope.parent = parent;
    return localScope;
  };

  scopes.GlobalScope = function() {
    var globalScope = Object.create(new Scope());
    this.prototype = globalScope.__proto__;
    globalScope.__proto__ = this.prototype;
    this.loadBuiltInTypes.apply(globalScope);

    return globalScope;
  };

  scopes.GlobalScope.prototype.resolve = function() {
    return undefined;
  };

  scopes.GlobalScope.prototype.loadBuiltInTypes = function() {
    var self = this;
    for(var typeName in typeSystem.builtInTypes) {
      if (!typeSystem.builtInTypes.hasOwnProperty(typeName))
        continue;
      self.symbols[typeName] = typeSystem.builtInTypes[typeName];
    }
  };

  module.exports = scopes;
})();