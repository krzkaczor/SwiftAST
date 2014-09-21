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
    this.CLASS = "ReturnStatement";
    this.expression = expression;
  };

  nodes.ParenthesizedExpression = function(expressions) {
    this.CLASS = "ParenthesizedExpression";
    this.expressions = expressions;
  };

  nodes.ConstantDeclaration = function (pattern, expression) {
    this.CLASS = "ConstantDeclaration";
    this.pattern = pattern;
    this.expression = expression;
  };

  nodes.TuplePattern = function (pattern) {
    this.CLASS = "TuplePattern";
    this.patterns = [pattern];
  };

  nodes.TuplePattern.prototype.add = function(pattern) {
    this.patterns.push(pattern);
  };

  nodes.FunctionDeclaration = function(name, parameters, block, returnType) {
    this.CLASS = "FunctionDeclaration";
    this.name = name.value;
    this.parameters = parameters;
    this.block = block;
    this.returnTypeDeclaredBare = returnType;
  };

  nodes.Parameter = function(name, type){
    this.CLASS = "Parameter";
    this.name = name.value;
    this.typeDeclared = type;
  };

  nodes.NamedTypeNode = function(name) {
    this.CLASS = "NamedTypeNode";
    this.name = name.value;
    this.id; // set directly by parser
  };

  nodes.FunctionTypeNode = function(paramType, returnType) {
    this.CLASS = "FunctionTypeNode";
    this.paramType = paramType;
    this.returnType = returnType;
  };

  nodes.TupleTypeNode = function(typesBare) {
    this.CLASS = "TupleTypeNode";
    this.typesBare = typesBare;
  };

  nodes.IntegerNumberLiteral = function (value) {
    this.CLASS = "IntegerLiteral";
    this.value = parseInt(value);
  };

  nodes.StringLiteral = function (value) {
    this.CLASS = "StringLiteral";
    this.value = value;
  };

  nodes.IdentifierPattern = function(name, type) {
    this.CLASS = "IdentifierPattern";
    this.name = name.value;
    this.typeBare = type;
  };

  nodes.DoubleNumberLiteral = function (value) {
    this.CLASS = "DoubleLiteral";
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

  nodes.FunctionCall = function (callee, parenthesizedExpressions) {
    this.CLASS = "FunctionCall";
    this.callee = callee.value;
    this.args = parenthesizedExpressions;
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