(function () {
  var nodes = require("./models/nodes.js");
  var scopes = require("./models/scopes.js");
  var typeSystem = require("./typeSystem/typeSystem.js");
  var errors = require("./models/errors.js");

  nodes.TopLevelBlock.prototype.fillType = function () {
    var self = this;
    this.scope = new scopes.RootScope(typeSystem.builtInTypes);

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

  nodes.IfStatement.prototype.fillType = function(scope) {
    this.condition.fillType(scope);
    this.block.fillType(scope);

    return this;
  };

  nodes.ReturnStatement.prototype.fillType = function(scope) {
    this.scope = scope;
    if (this.expression)
      this.type = this.expression.fillType(scope).type;

    return this;
  };

  nodes.ConstantDeclaration.prototype.fillType = function (scope) {
    this.scope = scope;

    var expressionType = this.expression.fillType(scope).type;

    this.type = this.pattern.fillType(scope, expressionType).type;

    return this;
  };

  nodes.IdentifierPattern.prototype.fillType = function(scope, expressionType) {
    if (this.typeBare) {
      var typeDeclared = this.typeBare.fillType(scope).type;

      if (!typeDeclared.eq(expressionType) && !expressionType.isSubtype(typeDeclared)) {
        throw new errors.TypeInconsistencyError([typeDeclared, expressionType]);
      }

      this.type = typeDeclared.ensureNotLiteral();
    } else {
      this.type = expressionType.ensureNotLiteral();
    }
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
      return expr.fillType(scope).type;
    });

    this.type = new typeSystem.types.TupleType(this.expressionsTypes, this.ids);
    return this;
  };

  nodes.FunctionDeclaration.prototype.fillType = function(parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      parameter.fillType(self.scope);
    });

    this.paramsTypes = new typeSystem.types.TupleType(this.parameters.map(function(param) { return param.type}));
    if (this.returnTypeDeclaredBare)
      this.returnType = this.returnTypeDeclaredBare.fillType(parentScope).type;
    else {
      this.returnType = new typeSystem.types.TupleType([]);
    }
    parentScope.defineFunction(this.name, new typeSystem.types.FunctionType(this.paramsTypes, this.returnType));
    this.block.fillType(this.scope);

    return this;
  };

  nodes.Parameter.prototype.fillType = function(scope) {
    this.scope = scope;
    this.type = this.typeDeclared.fillType(scope).type;
    this.scope.defineConstant(this.name, this.type);
    return this;
  };

  nodes.IntegerNumberLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("IntLiteral");
    return this;
  };

  nodes.StringLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("StringLiteral");
    return this;
  };

  nodes.BoolLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("BoolLiteral");
    return this;
  };

  nodes.NamedTypeNode.prototype.fillType = function(scope) {
    this.type = scope.resolve(this.name);
    return this;
  };

  nodes.FunctionTypeNode.prototype.fillType = function(scope) {
    this.type = new typeSystem.types.FunctionType(this.paramType.fillType(scope).type, this.returnType.fillType(scope).type);

    return this;
  };

  nodes.TupleTypeNode.prototype.fillType = function(scope){
    this.types = this.typesBare.map(function(type) {
      return type.fillType(scope).type;
    });

    var ids = this.typesBare.map(function(type) {
      return type.id;
    });

    if (this.types.length == 1) {
      this.type = this.types[0];
    } else {
      this.type = new typeSystem.types.TupleType(this.types, ids);
    }

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
    this.args.fillType(scope);

    this.verifyTypes(scope);

    return this;
  };

  nodes.FunctionCall.prototype.verifyTypes = function(scope) {
    var argsType = this.args.fillType(scope).type,
        paramType = this.functionType.paramType;

    if( !argsType.eq(paramType) && !argsType.isSubtype(paramType))
      throw new errors.TypeInconsistencyError([this.args.type, this.functionType.paramType])
  };

  nodes.MemberAccess.prototype.fillType = function(scope) {
    this.left.fillType(scope);
    this.verifyTypes(scope);

    this.type = this.left.type.access(this.right.value);
    return this;
  };

  nodes.MemberAccess.prototype.verifyTypes = function() {
    if (!this.left.type.accessible)
      throw new errors.TypeNotAccessibleError(this);
  };

  nodes.OperatorCall.prototype.fillType = function (scope) {
    this.scope = scope;
    this.left.fillType(scope);
    this.right.fillType(scope);

    this.type = this.left.type.findCommonType(this.right.type) || this.left.type.ensureNotLiteral().findCommonType(this.right.type.ensureNotLiteral());
    return this;
  };

  nodes.LogicalOperatorCall.prototype.fillType = function (scope) {
    this.scope = scope;
    this.left.fillType(scope);
    this.right.fillType(scope);

    this.type = typeSystem.builtInTypes.Bool; //@todo
    return this;
  };
})();