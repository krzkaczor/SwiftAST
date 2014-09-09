var assert = require("assert");
var fs = require("fs");
var path = 'tests/fixtures/';
var errors = require("../SwiftScript/models/errors.js");
var SwiftScript = require("../SwiftScript/swiftScript.js");

describe("Scopes", function() {
  var swiftScript;
  beforeEach(function() {
    swiftScript = new SwiftScript();
  });

  it('should built scopes correctly', function() {
    var input = fs.readFileSync(path + "MultipleScopes.swift", "utf8");
    var ast = swiftScript.astWithTypes(input);
  });
});