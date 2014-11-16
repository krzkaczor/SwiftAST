(function() {
  var symbols = require('./typeSystem/symbols.js');
  var errors = require('./errors.js');
  var util = require('util');

  var Scope = function() { };

  Scope.prototype.inspect = function() {
    return util.inspect(this.symbols, {depth: 2});
  };

  Scope.prototype.define = function(name, type) {
    var currentResolvedSymbol = this.silentResolve(name, true);
    if (currentResolvedSymbol && currentResolvedSymbol.cannotOverwrite) {
      throw new errors.SymbolRedeclarationError(name);
    }

    this.symbols[name] = type;
  };

  Scope.prototype.defineFunction = function(name, type) {
    var symbol = new symbols.FunctionSymbol(name, type)
    this.define(name, symbol);
    return symbol;
  };

  Scope.prototype.defineVariable = function(name, type) {
    var symbol = new symbols.VariableSymbol(name, type);
    this.define(name, symbol);
    return symbol;
  };

  Scope.prototype.defineConstant = function(name, type, notInitialized) {
    var symbol = new symbols.ConstantSymbol(name, type, notInitialized);
    this.define(name, symbol);
    return symbol;
  };

  Scope.prototype.resolve = function(name) {
    var searchedSymbol = this.symbols[name];

    if (searchedSymbol)
      return searchedSymbol;

    if (this.parent)
      return this.parent.resolve(name);

    throw new errors.SymbolNotFoundError(name);
  };

  Scope.prototype.silentResolve = function(name, onlyCurrentScope) {
    var searchedSymbol = this.symbols[name];

    if (searchedSymbol)
      return searchedSymbol;

    if (this.parent && !onlyCurrentScope)
      return this.parent.silentResolve(name);
  };


  var scopes = {};

  scopes.LocalScope = function(parent) {
    this.parent = parent;
    this.symbols = {};
  };

  scopes.LocalScope.prototype = new Scope();

  scopes.RootScope = function(builtInTypes) {
    this.symbols = {};
    this.loadBuiltInTypes(builtInTypes);
  };

  scopes.RootScope.prototype = new Scope();

  scopes.RootScope.prototype.loadBuiltInTypes = function(builtInTypes) {
    var self = this;
    for(var typeName in builtInTypes) {
      if (!builtInTypes.hasOwnProperty(typeName))
        continue;
      self.symbols[typeName] = builtInTypes[typeName];
    }
  };

  scopes.WrapScope = function(scopeToWrap) {
    this.wrapped = scopeToWrap;
  };

  scopes.WrapScope.prototype.resolve = function(name) {
    return this.wrapped.resolve(name);
  };

  module.exports = scopes;
})();