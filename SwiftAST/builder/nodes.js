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
        if (item && typeof item !== 'function') {
          removeScope(node[item]);
        }
      }
    };

    removeScope(this);
    return this;
  };

  nodes.ClassDeclaration = function(name, declarations) {
    this.CLASS = "ClassDeclaration";
    this.name = name;
    this.declarations = declarations;
  };

  nodes.AssignmentStatement = function(leftExpression, rightExpression) {
    this.CLASS = 'AssigmentStatement';
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
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
    this.expressions = expressions? expressions : [];
    this.ids = this.expressions.map(function(expr) {
      return expr.id;
    });
  };

  nodes.IfStatement = function(condition, block) {
    this.condition = condition;
    this.block = block;
  };

  nodes.ConstantDeclaration = function (pattern, expression) {
    this.CLASS = "ConstantDeclaration";
    this.pattern = pattern;
    this.expression = expression;
  };

  nodes.VariableDeclaration = function (pattern, expression) {
    this.CLASS = "VariableDeclaration";
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
    this.name = name;
    this.parameters = parameters;
    this.block = block;
    this.returnTypeDeclaredBare = returnType;
  };

  nodes.InitializerDeclaration = function(parameters, block) {
    this.CLASS = "InitializerDeclaration";
    this.name = "init";
    this.parameters = parameters;
    this.block = block;
  };

  nodes.Parameter = function(name, type, externalName){
    this.CLASS = "Parameter";
    this.name = name;
    this.typeDeclared = type;
    this.externalName = externalName? externalName.value : undefined;
  };

  nodes.NamedTypeNode = function(name) {
    this.CLASS = "NamedTypeNode";
    this.name = name;
    this.id; // @todo set directly by parser
  };

  nodes.FunctionTypeNode = function(paramType, returnType) {
    this.CLASS = "FunctionTypeNode";
    this.paramType = paramType;
    this.returnType = returnType;
  };

  nodes.ClosureExpression = function(parameters, block, returnType) {
    this.CLASS = "ClosureExpression";
    this.parameters = parameters;
    this.block = block;
    this.returnTypeDeclaredBare = returnType;
  };

  nodes.TupleTypeNode = function(typesBare) {
    this.CLASS = "TupleTypeNode";
    this.typesBare = typesBare;
  };

  nodes.ArrayTypeNode = function(typeBare) {
    this.CLASS = "ArrayTypeNode";
    this.typeBare = typeBare;
  };

  nodes.ArrayLiteral = function(elements) {
    this.CLASS = "ArrayLiteral";
    this.elements = elements;
  }

  nodes.IntegerNumberLiteral = function (value) {
    this.CLASS = "IntLiteral";
    this.value = parseInt(value);
  };

  nodes.StringLiteral = function (value) {
    this.CLASS = "StringLiteral";
    this.value = value;
  };

  nodes.BoolLiteral = function (value) {
    this.CLASS = "BoolLiteral";
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
    this.value = callee.value;
    this.callee = callee;
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

  nodes.LogicalOperatorCall = function (operator, left, right) {
    this.CLASS = "LogicalOperatorCall";
    this.operator = operator;
    this.left = left;
    this.right = right;
  };

  module.exports = nodes;
})
();