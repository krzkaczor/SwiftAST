"use strict";
(function () {
  var nodes = {};

  nodes.TopLevelBlock = function (statements) {
    this.CLASS = 'TopLevelBlock';
    this.statements = statements;
  };

  nodes.TopLevelBlock.prototype.removeScopes = function () {
    var removeScope = function removeScope(node) {
      if (node === undefined || (typeof node !== "object" && typeof node !== "array"))
        return;
      if (node.scope)
        delete node.scope;

      for(var item in node) {
        if (typeof item !== 'function') {
          removeScope(node[item]);
        }
      }
    };

    removeScope(this);
    return this;
  };

  nodes.Block = function (statements) {
    this.CLASS = 'Block';
    this.statements = statements;
  };

  nodes.ReturnStatement = function(expression) {
    this.expression = expression;
  }

  nodes.ConstantDeclaration = function (name, expression, type) {
    this.CLASS = "ConstantDeclaration";
    this.name = name;
    this.typeDeclaredBare = type;
    this.expression = expression;
  };

  nodes.FunctionDeclaration = function(name, parameters, block, returnType) {
    this.CLASS = "FunctionDeclaration";
    this.name = name;
    this.parameters = parameters;
    this.block = block;
    this.returnTypeDeclaredBare = returnType;
  };

  nodes.Parameter = function(name, type){
    this.CLASS = "Parameter";
    this.name = name;
    this.typeDeclaredBare = type;
  };

  nodes.IntegerNumberLiteral = function (value) {
    this.CLASS = "NumberLiteral";
    this.value = parseInt(value);
  };

  nodes.DoubleNumberLiteral = function (value) {
    this.CLASS = "DoubleNumberLiteral";
    this.value = parseFloat(value);
  };

  nodes.Id = function (value) {
    this.CLASS = 'Id';
    this.value = value;
  };

  nodes.ArrayExpression = function (exprs) {
    this.CLASS = 'Array';
    this.items = exprs;
  };

  nodes.ForInLoop = function (iteratorExpr, iteratorId, block) {
    this.CLASS = 'ForInLoop';
    this.iteratorExpr = iteratorExpr;
    this.iteratorId = iteratorId;
    this.block = block;
  };

  nodes.FunctionCall = function (callee, args) {
    this.CLASS = "FunctionCall";
    this.callee = callee;
    this.args = args;
  };

  nodes.MemberAccess = function (left, right) {
    this.CLASS = "MemberAccess";
    this.left = left;
    this.right = right;
  };

  nodes.OperatorCall = function (operator, left, right) {
    this.CLASS = "OperatorCall";
    this.operator = operator;
    this.left = left;
    this.right = right;
  };

  module.exports = nodes;
})
();