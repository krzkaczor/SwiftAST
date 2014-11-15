'use strict';
(function () {
  var nodes = require("./../builder/nodes.js");
  var scopes = require("./scopes.js");
  var typeSystem = require("./typeSystem/typeSystem.js");
  var errors = require("./errors.js");

  nodes.TopLevelBlock.prototype.analyze = function () {
    var self = this;
    this.scope = new scopes.RootScope(typeSystem.builtInTypes);

    this.statements.forEach(function (statement) {
      statement.analyze(self.scope);
    });
    return this;
  };

  nodes.Id.prototype.analyze = function(scope){
    this.scope = scope;
    this.symbol = scope.resolve(this.value);
    this.type = this.symbol.type;

    return this;
  };
  nodes.Block.prototype.analyze = function (parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);

    this.statements.forEach(function (statement) {
      statement.analyze(self.scope);
    });
    return this;
  };

  nodes.IfStatement.prototype.analyze = function(scope) {
    this.condition.analyze(scope);
    this.block.analyze(scope);

    return this;
  };

  nodes.ReturnStatement.prototype.analyze = function(scope) {
    this.scope = scope;
    if (this.expression)
      this.type = this.expression.analyze(scope).type;

    return this;
  };

  nodes.AssignmentStatement.prototype.analyze = function(scope) {
    this.scope = scope;
    this.leftExpression.analyze(scope);
    this.rightExpression.analyze(scope);

    if (!this.leftExpression.symbol)
      throw new errors.SymbolNotFoundError();

    if (this.leftExpression.symbol.cannotOverwrite)
      throw new errors.ConstantAssignmentError(this.id);


    var rightExpressionType = this.rightExpression.type,
        leftExpressionType = this.leftExpression.type;
    if (!rightExpressionType.eq(leftExpressionType) && !rightExpressionType.isSubtype(leftExpressionType)) {
      throw new errors.TypeInconsistencyError([rightExpressionType, leftExpressionType])
    }
  };

  nodes.ConstantDeclaration.prototype.analyze = function (scope) {
    this.scope = scope;

    var expressionType = this.expression.analyze(scope).type;

    this.type = this.pattern.analyze(scope, expressionType, scope.defineConstant.bind(scope)).type;

    return this;
  };

  nodes.VariableDeclaration.prototype.analyze = function (scope) {
    this.scope = scope;

    var expressionType = this.expression.analyze(scope).type;

    this.type = this.pattern.analyze(scope, expressionType, scope.defineVariable.bind(scope)).type;

    return this;
  };

  nodes.IdentifierPattern.prototype.analyze = function(scope, expressionType, definer) {
    if (this.typeBare) {
      var typeDeclared = this.typeBare.analyze(scope).type;

      if (!typeDeclared.eq(expressionType) && !expressionType.isSubtype(typeDeclared)) {
        throw new errors.TypeInconsistencyError([typeDeclared, expressionType]);
      }

      this.type = typeDeclared.ensureNotLiteral();
    } else {
      this.type = expressionType.ensureNotLiteral();
    }
    definer(this.name, this.type);
    return this;
  };

  nodes.TuplePattern.prototype.analyze = function(scope, expressionType, definer) {
    if (expressionType.CLASS !== "TupleType") {
      throw new errors.TypeInconsistencyError([typeSystem.builtInTypes.TupleType, expressionType.type]);
    }

    if(this.patterns.length != expressionType.expressionsTypes.length) {
      throw new errors.TypeInconsistencyError([this.patterns, expressionType.expressionsTypes]);
    }

    for(var i = 0;i < this.patterns.length;i++) {
      this.patterns[i].analyze(scope, expressionType.expressionsTypes[i], definer);
    }

    return this;
  };

  nodes.ParenthesizedExpression.prototype.analyze = function(scope) {
    this.expressionsTypes = this.expressions.map(function(expr) {
      return expr.analyze(scope).type;
    });

    this.type = new typeSystem.types.TupleType(this.expressionsTypes, this.ids);
    return this;
  };

  nodes.ClassDeclaration.prototype.analyze = function(parentScope) {
    this.scope = new scopes.LocalScope(parentScope);
    this.type = new typeSystem.types.ClassType(this.name, this.scope);
    this.scope.defineConstant('self', this.type);

    var self = this;
    this.declarations.forEach(function(declaration) {
      declaration.analyze(self.scope);
    });

    this.findInits();

    parentScope.defineFunction(this.name, this.inits[0].type);
  };

  nodes.ClassDeclaration.prototype.findInits = function() {
    var inits = [];
    this.inits = inits;
    this.declarations.forEach(function(declaration) {
      if (declaration.name === 'init') {
        inits.push(declaration);
      }
    });

    //always make sure that there is at least one init
    if (!this.inits.length) {
      this.inits.push(new nodes.InitializerDeclaration());
    }
  };

  nodes.InitializerDeclaration.prototype.analyze = function(parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      parameter.analyze(self.scope);
    });

    this.paramsTypes = new typeSystem.types.TupleType(this.parameters.map(function(param) { return param.type}), this.parameters.map(function(param) { return param.externalName}));
    var ids = this.parameters.map(function(param) { return param.name });
    this.paramsTypes = this.paramsTypes.createNamedTuple(ids);

    this.returnType = parentScope.resolve('self').type;

    this.type = new typeSystem.types.FunctionType(this.paramsTypes, this.returnType);
    parentScope.defineFunction(this.name, this.type);
    this.block.analyze(this.scope);

    return this;
  }

  nodes.FunctionDeclaration.prototype.analyze = function(parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      parameter.analyze(self.scope);
    });

    this.paramsTypes = new typeSystem.types.TupleType(this.parameters.map(function(param) { return param.type}), this.parameters.map(function(param) { return param.externalName}));
    if (this.returnTypeDeclaredBare)
      this.returnType = this.returnTypeDeclaredBare.analyze(parentScope).type;
    else {
      this.returnType = new typeSystem.types.TupleType([]);
    }

    parentScope.defineFunction(this.name, new typeSystem.types.FunctionType(this.paramsTypes, this.returnType));
    this.block.analyze(this.scope);

    return this;
  };

  nodes.ClosureExpression.prototype.analyze = function(parentScope){
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      parameter.analyze(self.scope);
    });

    this.paramsTypes = new typeSystem.types.TupleType(this.parameters.map(function(param) { return param.type}), this.parameters.map(function(param) { return param.externalName}));
    if (this.returnTypeDeclaredBare)
      this.returnType = this.returnTypeDeclaredBare.analyze(parentScope).type;
    else {
      this.returnType = new typeSystem.types.TupleType([]);
    }

    this.block.analyze(this.scope);

    this.type = new typeSystem.types.FunctionType(this.paramsTypes, this.returnType);

    return this;
  };

  nodes.Parameter.prototype.analyze = function(scope) {
    this.scope = scope;
    this.type = this.typeDeclared.analyze(scope).type;
    this.scope.defineConstant(this.name, this.type);
    return this;
  };

  nodes.IntegerNumberLiteral.prototype.analyze = function (scope) {
    this.scope = scope;
    this.symbol = scope.silentResolve(this.value);
    this.type = scope.resolve("IntLiteral");

    return this;
  };

  nodes.StringLiteral.prototype.analyze = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("StringLiteral");
    return this;
  };

  nodes.BoolLiteral.prototype.analyze = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("BoolLiteral");
    return this;
  };

  nodes.NamedTypeNode.prototype.analyze = function(scope) {
    this.type = scope.resolve(this.name);
    return this;
  };

  nodes.FunctionTypeNode.prototype.analyze = function(scope) {
    this.type = new typeSystem.types.FunctionType(this.paramType.analyze(scope).type, this.returnType.analyze(scope).type);

    return this;
  };

  nodes.TupleTypeNode.prototype.analyze = function(scope){
    this.types = this.typesBare.map(function(type) {
      return type.analyze(scope).type;
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

  nodes.DoubleNumberLiteral.prototype.analyze = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("DoubleLiteral"); //could be done while creation of object
    return this;
  };

  nodes.Id.prototype.analyze = function (scope) {
    this.scope = scope;
    this.symbol = scope.resolve(this.value);
    this.type = this.symbol.type;

    return this;
  };

  nodes.ArrayExpression.prototype.analyze = function (scope) {
    this.scope = scope;
    var array = scope.resolve("Array");
    var itemsTypes = this.items.map(function (item) {
          return item.analyze(scope)
        }
    );
    this.type = new typeSystem.types.CompoundTypeSymbol(array, itemsTypes[0]);
    return this;
  };

  nodes.ForInLoop.prototype.analyze = function (scope) {
    this.scope = new scopes.LocalScope(scope);
    this.scope.define(this.iteratorId.value, this.iteratorExpr.analyze(this.scope));
    this.block.analyze(this.scope);
    return this;
  };

  nodes.FunctionCall.prototype.analyze = function (scope) {
    this.scope = scope;
    this.callee.analyze(scope);
    this.type = this.callee.type.returnType;
    this.args.analyze(scope);

    this.verifyTypes(scope);

    return this;
  };

  nodes.FunctionCall.prototype.verifyTypes = function(scope) {
    var argsType = this.args.type,
        paramType = this.callee.type.paramType;

    if( !argsType.eq(paramType) && !argsType.isSubtypeWithExactIds(paramType))
      throw new errors.TypeInconsistencyError([argsType, paramType]) //todo: appropriate error type for situation when didn't used named parameteres
  };

  nodes.MemberAccess.prototype.analyze = function(scope) {
    this.left.analyze(scope);
    this.verifyTypes(scope);

    this.symbol = this.left.type.access(this.right.value);
    this.type = this.symbol.type;

    return this;
  };

  nodes.MemberAccess.prototype.verifyTypes = function() {
    if (!this.left.type.accessible)
      throw new errors.TypeNotAccessibleError(this);
  };

  nodes.OperatorCall.prototype.analyze = function (scope) {
    this.scope = scope;
    this.left.analyze(scope);
    this.right.analyze(scope);

    this.type = this.left.type.findCommonType(this.right.type) || this.left.type.ensureNotLiteral().findCommonType(this.right.type.ensureNotLiteral());
    return this;
  };

  nodes.LogicalOperatorCall.prototype.analyze = function (scope) {
    this.scope = scope;
    this.left.analyze(scope);
    this.right.analyze(scope);

    this.type = typeSystem.builtInTypes.Bool; //@todo
    return this;
  };
})();