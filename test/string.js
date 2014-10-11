var assert = require("assert");
var fs = require("fs");
var path = 'test/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var typeSystem = require("../SwiftScript/typeSystem/typeSystem.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("String", function() {
  var swiftScript;
  beforeEach(function () {
    swiftScript = new SwiftScript();
  });

  it('should recognise string', function() {
    var input = fs.readFileSync(path + "BunchOfStrings.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);

    var scope = ast.scope;
    var string1 = scope.resolve("string1");
    assert.equal(string1.type.eq(typeSystem.builtInTypes.String), true);
    assert.equal(ast.statements[0].expression.type.eq(typeSystem.builtInTypes.StringLiteral), true);
  });
});