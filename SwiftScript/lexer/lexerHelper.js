(function() {
  var lexerHelper = function(TOKEN) {
    if (TOKEN == 'NL' && !this.matchNL) {
      return;
    }

    if (TOKEN != 'NL') {
      this.matchNL = true;
    }

    if (TOKEN == 'SEM' || TOKEN == 'NL' || TOKEN == 'LCBRAC' ) {
      this.matchNL = false;
    }

    return TOKEN;
  };

  lexerHelper.matchNL = false;
  module.exports = lexerHelper;
})();