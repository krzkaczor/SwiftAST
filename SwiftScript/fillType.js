(function () {
  var nodes = require("./models/nodes.js");
  var scopes = require("./models/scopes.js");
  var typeSystem = require("./models/typeSystem.js");
  var errors = require("./models/errors.js");

  nodes.TopLevelBlock.prototype.fillType = function () {
    var self = this;
    this.scope = new scopes.GlobalScope();

    this.statements.forEach(function (statement) {
      statement.fillType(self.scope);
    });
    return this;
  };

  nodes.Block.prototype.fillType = function (parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);

    this.statements.forEach(function (statement) {
      statement.fillType(self.scope);
    });
    return this;
  };

  nodes.ReturnStatement.prototype.fillType = function(scope) {
    this.scope = scope;
    if (this.expression)
      this.type = this.expression.fillType(scope).type;
  };

  nodes.ConstantDeclaration.prototype.fillType = function (scope) {
    this.scope = scope;

    var expressionType = this.expression.fillType(scope).type.ensureNotLiteral();

    this.type = this.pattern.fillType(scope, expressionType).type;

    return this;
  };

  nodes.IdentifierPattern.prototype.fillType = function(scope, expressionType) {
    if (this.typeBare) {
      var typeDeclared = this.typeBare.fillType(scope).type;
    }
    if (this.typeBare && typeDeclared !== expressionType) {
      throw new errors.TypeInconsistencyError([typeDeclared, expressionType]);
    }

    this.type = expressionType;
    scope.defineConstant(this.name, this.type);

    return this;
  };

  nodes.TuplePattern.prototype.fillType = function(scope, expressionType) {
    if (expressionType.CLASS !== "TupleType" || this.patterns.length != expressionType.expressionsTypes.length)
      throw new errors.TypeInconsistencyError([this.patterns, expressionType.expressionsTypes]);

    for(var i = 0;i < this.patterns.length;i++) {
      this.patterns[i].fillType(scope, expressionType.expressionsTypes[i]);
    }

    return this;
  };

  nodes.ParenthesizedExpression.prototype.fillType = function(scope) {
    this.expressionsTypes = this.expressions.map(function(expr) {
      return expr.fillType(scope).type.ensureNotLiteral();
    });

    this.type = new typeSystem.types.TupleType(this.expressionsTypes);
    return this;
  };

  nodes.FunctionDeclaration.prototype.fillType = function(parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      self.scope.defineConstant(parameter.name, parameter.fillType(self.scope).type);
    });

    this.block.fillType(this.scope);
    this.paramsTypes = this.parameters.map(function(param) { return param.type});
    this.returnType = this.scope.resolve(this.returnTypeDeclaredBare.value);
    parentScope.defineFunction(this.name, new typeSystem.types.FunctionType(this.paramsTypes, this.returnType));
  };

  nodes.Parameter.prototype.fillType = function(scope) {
    this.scope = scope;
    this.type = this.typeDeclared.fillType(scope).type;
    this.scope.defineConstant(this.name, this.type);
    return this;
  };

  nodes.IntegerNumberLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("IntegerLiteral"); //could be done while creation of object
    return this;
  };

  nodes.NamedTypeNode.prototype.fillType = function(scope) {
    this.type = scope.resolve(this.name);
    return this;
  };

  nodes.FunctionTypeNode.prototype.fillType = function(scope) {
    this.type = new typeSystem.types.FunctionType([this.paramType[0].fillType(scope).type], this.returnType.fillType(scope).type);

    return this;
  };

  nodes.DoubleNumberLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("DoubleLiteral"); //could be done while creation of object
    return this;
  };

  nodes.Id.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve(this.value).type;

    return this;
  };

  nodes.ArrayExpression.prototype.fillType = function (scope) {
    this.scope = scope;
    var array = scope.resolve("Array");
    var itemsTypes = this.items.map(function (item) {
          return item.fillType(scope)
        }
    );
    this.type = new typeSystem.types.CompoundTypeSymbol(array, itemsTypes[0]);
    return this;
  };

  nodes.ForInLoop.prototype.fillType = function (scope) {
    this.scope = new scopes.LocalScope(scope);
    this.scope.define(this.iteratorId.value, this.iteratorExpr.fillType(this.scope));
    this.block.fillType(this.scope);
    return this;
  };

  nodes.FunctionCall.prototype.fillType = function (scope) {
    this.scope = scope;
    this.functionType = this.scope.resolve(this.callee).type;
    this.type = this.functionType.returnType;
    this.args.forEach(function(arg) {
      arg.fillType(scope);
    });

    this.verifyTypes(scope);

    return this;
  };

  nodes.FunctionCall.prototype.verifyTypes = function(scope) {
    if (this.args.length != this.functionType.paramsTypes.length)
      throw new errors.TypeInconsistencyError([this.args, this.functionType.paramsTypes]);

    for(var i = 0;i < this.args.length; i++) {
      var argType = this.args[i].type,
          paramType = this.functionType.paramsTypes[i];

      if ( !argType.eq(paramType) && !argType.isSubtype(paramType))
        throw new errors.TypeInconsistencyError([argType, paramType]);
    }
  };

  //nodes.MemberAccess.prototype.fillType = function(scope) {
  //  return scope.resolve.
  //}

  nodes.OperatorCall.prototype.fillType = function (scope) {
    this.scope = scope;
    this.left.fillType(scope);
    this.right.fillType(scope);

    this.type = this.left.type.findCommonType(this.right.type) || this.left.type.ensureNotLiteral().findCommonType(this.right.type.ensureNotLiteral());
    return this;
  };
})();