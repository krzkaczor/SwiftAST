(function() {
  var fs = require("fs");
  var jison = require("jison");
  var utils = require("./utils.js");
  //var rewritter  = require("./rewritter/rewritter.js");

  var SwiftScript = function() {
    var lexer = fs.readFileSync("./SwiftScript/lexer/lexer.jisonlex", "utf8");
    var parser = fs.readFileSync("./SwiftScript/parser/parser.jison", "utf8");

    //alter rules to match actual data structure
    lexer = lexer.replace(/return[ ]?o[ ]?\(/g, "return yy.lexerHelper.call(this,");
    parser = parser.replace(/new[ ]+([.a-zA-Z])?/g, "new yy.nodes.$1");
    //parser = parser.replace(/new[ ]+yy.nodes.([\.a-zA-Z]*)Type\(/g, "new yy.types.$1Type(");

    var grammar = lexer + parser;
    this.parser = new jison.Parser(grammar);

    var lexerHelper = require("./lexer/lexerHelper.js");
    var nodes = require("./models/nodes.js");
    var types = require('./models/typeSystem.js').types;
    require("./fillType.js");

    this.parser.yy = {
      types: types,
      nodes: nodes,
      lexerHelper: lexerHelper
    };
  };

  SwiftScript.prototype.ast = function(input) {
    return this.parser.parse(input);
  };

  SwiftScript.prototype.astWithTypes = function(input) {
    var astWithTypes = this.ast(input).fillType();

    return astWithTypes;
  };

  module.exports = SwiftScript;
})();

// i think it shouldn't validate types but just find them
//maybe rewritter should rewrite ast and translator should translate it?
