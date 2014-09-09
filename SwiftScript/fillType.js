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
      this.type = this.expression.fillType().type;
  };

  nodes.ConstantDeclaration.prototype.fillType = function (scope) {
    this.scope = scope;

    if (this.typeDeclaredBare)
      var typeDeclared = this.scope.resolve(this.typeDeclaredBare.value);
    var expressionType = this.expression.fillType(scope).type.ensureNotLiteral();
    if (!typeDeclared)
      this.type = expressionType;
    else if (typeDeclared !== expressionType) {
        throw new errors.TypeInconsistencyError([typeDeclared, expressionType]);
    } else {
      this.type = expressionType;
    }
    if (this.type != expressionType)
    this.type = type.makeConcrete ? type.makeConcrete() : type;

    this.scope.defineConstant(this.name.value, this.type);
    return this;
  };

  nodes.FunctionDeclaration.prototype.fillType = function(parentScope) {
    var self = this;
    this.scope = new scopes.LocalScope(parentScope);
    this.parameters.forEach(function(parameter) {
      self.scope.defineConstant(parameter.name.value, parameter.fillType(self.scope).type);
    });

    this.block.fillType(this.scope);
    this.returnType = this.scope.resolve(this.returnTypeDeclaredBare.value);
    parentScope.define(this.name, this);
  };

  nodes.Parameter.prototype.fillType = function(scope) {
    this.scope = scope;
    this.type = this.scope.resolve(this.typeDeclaredBare.value);
    this.scope.define(this.name, this.type);
    return this;
  };

  nodes.IntegerNumberLiteral.prototype.fillType = function (scope) {
    this.scope = scope;
    this.type = scope.resolve("IntegerLiteral"); //could be done while creation of object
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
    return this
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
    this.type = this.scope.resolve(this.name);
    return this;
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