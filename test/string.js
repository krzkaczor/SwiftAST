var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftAst/analyzer/errors.js");
var typeSystem = require("../SwiftAst/analyzer/typeSystem/typeSystem.js");
var SwiftAst = require("../SwiftAst/SwiftAst.js");
var path = require('path');

describe("String", function() {
  var swiftAst;
  beforeEach(function () {
    swiftAst = new SwiftAst();
  });

  it('should recognise string', function() {
    var input = fs.readFileSync(path.join(__dirname, 'fixtures', "BunchOfStrings.swift"), "utf8");
    var ast = swiftAst.ast(input);

    var scope = ast.scope;
    var string1 = scope.resolve("string1");
    assert.equal(string1.type.eq(typeSystem.builtInTypes.String), true);
    assert.equal(ast.statements[0].expression.type.eq(typeSystem.builtInTypes.StringLiteral), true);
  });
});