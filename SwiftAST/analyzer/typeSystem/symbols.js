(function() {
  var symbols = {};

  symbols.VariableSymbol = function (name, type) {
    this.CLASS = "VariableTypeSymbol";
    this.name = name;
    this.type = type;
  };

  symbols.ConstantSymbol = function (name, type, notInitialized) {
    this.CLASS = "ConstantTypeSymbol";
    this.name = name;
    this.type = type;
    this.initialized = !notInitialized;

    this.cannotOverwrite = true;
  };

  symbols.FunctionSymbol = function (name, type) {
    this.CLASS = "FunctionTypeSymbol";
    this.name = name;
    this.type = type;

    this.cannotOverwrite = true;
  };

  module.exports = symbols;
})();