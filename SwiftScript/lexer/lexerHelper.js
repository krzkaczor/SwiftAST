(function() {
  var matchNL = false;
  var lexerHelper = function(TOKEN) {
    if (TOKEN == 'NL' && !matchNL) {
      return;
    }

    if (TOKEN != 'NL') {
      matchNL = true;
    }

    if (TOKEN == 'SEM' || TOKEN == 'NL' || TOKEN == 'LCBRAC' ) {
      matchNL = false;
    }

    if (TOKEN == 'DOT') {
      this.begin("after-dot");
    } else if (this.conditionStack[this.conditionStack.length - 1] == "after-dot") {
      this.popState();
    }

    return TOKEN;
  };


  module.exports = lexerHelper;
})();