/**
 * Created by krzysztofkaczor on 11/2/14.
 */
(function() {
  var fs = require("fs");
  var jison = require("jison");
  var utils = require("./utils.js");
  var path = require('path');
  var analyze = require('./analyzer/analyze');


  function createGrammar() {
    //todo: exchange with relative path http://stackoverflow.com/questions/15254861/relative-file-system-write-path-within-module
    console.log(__dirname);
    var lexer  = fs.readFileSync(path.join(__dirname, "builder/lexer/lexer.jisonlex"), "utf8");
    var parser = fs.readFileSync(path.join(__dirname, "builder/parser/parser.jison"), "utf8");

    //alter rules to match actual data structure
    lexer = lexer.replace(/return[ ]?o[ ]?\(/g, "return yy.lexerHelper.call(this,");
    parser = parser.replace(/new[ ]+([.a-zA-Z])?/g, "new yy.nodes.$1");

    var grammar = lexer + parser;
    return grammar;
  }

  var SwiftAst = function() {
    var grammar = createGrammar();
    this.parser = new jison.Parser(grammar);

    var lexerHelper = require("./builder/lexer/lexerHelper.js");
    var nodes = require("./builder/nodes.js");

    this.parser.yy = {
      nodes: nodes,
      lexerHelper: lexerHelper
    };
  };

  SwiftAst.prototype.ast = function(input) {
    return this.parser.parse(this.processInput(input)).analyze();
  };

  //make input platform independence
  SwiftAst.prototype.processInput = function (input) {
    return input.replace(/\r/g, '');
  };

  module.exports = SwiftAst;
})();