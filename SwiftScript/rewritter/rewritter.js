(function () {
  function rewrite(node) {
    return node.rewrite();
  }

  nodes.Block.prototype.rewrite = function () {
    if (this.global) {
      return "(function() {\n{0}\n})();\n".format(this.statements.map(rewrite).join('\n'));
    }
    return "function({0}) {\n{1}\n}".format(this.args.map(rewrite).join(), this.statements.map(rewrite));
  };

  nodes.LetDeclaration.prototype.rewrite = function () {
    return "var {0} = {1};".format(this.variable.rewrite(), this.expression.rewrite());
  };

  nodes.NumberLiteral.prototype.rewrite = function () {
    return this.value;
  };

  nodes.Id.prototype.rewrite = function () {
    return this.value;
  };

  nodes.ArrayExpression.prototype.rewrite = function () {
    return "[{0}]".format(this.items.map(rewrite).join());
  };

  nodes.ForLoop.prototype.rewrite = function () {
    return "{0}.forEach({2})".format(this.iteratorExpr.rewrite(), this.iteratorVar.rewrite(), this.block.rewrite());
  };

  nodes.FunctionCall.prototype.rewrite = function () {
    return '{0}({1})'.format(this.callee.rewrite(), this.args.map(rewrite).join(", "));
  };

  nodes.MemberAccess.prototype.rewrite = function () {
    return '{0}.{1}'.format(this.left.rewrite(), this.right.rewrite());
  };

  nodes.OperatorCall.prototype.rewrite = function () {
    var functionName, prefix, infix;
    switch(this.operator) {
      case "..." : prefix = true; functionName = "BINARY_OPERATOR_RANGE_INCLUSIVE"; break;
      case "..<" : prefix = true; functionName = "BINARY_OPERATOR_RANGE_EXCLUSIVE"; break;
      case "+"   : infix = true; functionName = "+"; break;
    }

    functionName = new nodes.Id(functionName);

    if (prefix) {
      return (new nodes.FunctionCall(functionName, [ this.left, this.right])).rewrite();
    }
    if (infix) {
      return '{0} {1} {2}'.format(this.left.rewrite(), functionName.rewrite(), this.right.rewrite());
    }
    ;
  }

})();