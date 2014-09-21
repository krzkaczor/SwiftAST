(function() {
  var symbols = {};

  symbols.VariableSymbol = function (name, type) {
    this.name = name;
    this.type = type;
  };

  symbols.ConstantSymbol = function (name, type) {
    this.CLASS = "ConstantTypeSymbol";
    this.name = name;
    this.type = type;
  };

  module.exports = symbols;
})();