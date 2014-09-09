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
    parser = parser.replace(/new[ ]?/g, "new yy.nodes.");

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

//add strings
//what about functions types
//add better constant checking. when exactly error should be thrown?
//ensure that arrays are working + fix parsing types Array<Int>
//add typles
//spent some time to get inheritance right and rewrite it in project
//check if globalScope ingeritence coudn't use just prototype = new Scope
//should use normalized children list (think about it)
// i think it shouldn't validate types but just find them
//maybe rewritter should rewrite ast and translator should translate it?
