(function() {
  var scopes = require("../models/scopes.js");
  var errors = require("../models/errors.js");

  var TupleType = function (expressionsTypes, ids) {
    this.CLASS = "TupleType";
    this.expressionsTypes = expressionsTypes === undefined ? [] : expressionsTypes;
    this.canUnpack = this.expressionsTypes.length == 1;
    this.accessible = true;
    this.ids = ids === undefined? [] : ids;

    if(this.ids[0] && typeof this.ids[0] === 'object') {
      throw new errors.InternalError("id should be string");
    }

    this.scope = new scopes.RootScope();

    var self = this;
    this.expressionsTypes.forEach(function (type, i) {
      self.scope.defineConstant(i, type);
      //has additional id
      if (ids && ids[i]) {
        self.scope.defineConstant(ids[i], type);
      }
    });
  };

  var TypeRoot = require('./typeRoot.js');
  TupleType.prototype = new TypeRoot();

  TupleType.prototype.toString = function() {
    return "({0})".format(this.expressionsTypes.map(function (type) {
      return type.toString();
    }).join(", "))
  };

  TupleType.prototype.unpack = function () {
    return this.expressionsTypes[0];
  };

  TupleType.prototype.access = function (id) {
    return this.scope.resolve(id);
  };

  TupleType.prototype.eq = function (other) {
    if (this.expressionsTypes.length == 1)
      return other.eq(this.expressionsTypes[0]);

    if (this.CLASS != other.CLASS || this.expressionsTypes.length != other.expressionsTypes.length)
      return false;

    for (var i = 0; i < this.expressionsTypes.length; i++) {
      if (!this.expressionsTypes[i].eq(other.expressionsTypes[i]))
        return false;
    }
    return true;
  };

  TupleType.prototype.isSubtype = function (other) {
    if (this.expressionsTypes.length == 1) {
      return this.unpack().isSubtype(other);
    }

    if (this.CLASS != other.CLASS) {
      return false;
    }

    if (other.expressionsTypes.length == 1) {
      return this.isSubtype(other.unpack());
    }

    if (this.expressionsTypes.length != other.expressionsTypes.length) {
      return false;
    }

    //compare ids
    for(var i = 0;i < Math.max(this.ids.length, other.ids.length); i++) {
      if (this.ids[i] === undefined || other.ids[i] === undefined) {
        continue;
      }

      var id = this.ids[i],
          otherId = other.ids[i];

      if (id !== otherId) {
        return false;
      }
    }

    for (var i = 0; i < this.expressionsTypes.length; i++) {
      if (!this.expressionsTypes[i].isSubtype(other.expressionsTypes[i]))
        return false;
    }
    return true;
  };

  TupleType.prototype.isSubtypeWithExactIds = function(other) {
    //isSubtype is less strict comparison so if it fails we don't have to check further
    if (!this.isSubtype(other)) {
      return false;
    }

    if (other.CLASS != this.CLASS) {
      return !this.ids[0];
    }

    if (this.ids.length != other.ids.length) {
      return false;
    }

    for(var i = 0; i < this.ids.length; i++) {
      if (this.ids[i] != other.ids[i])
        return false;
    }

    return true
  };

  TupleType.prototype.ensureNotLiteral = function () {
    var notLiteralTypes = this.expressionsTypes.map(function (type) {
      return type.ensureNotLiteral();
    });

    return new TupleType(notLiteralTypes, this.ids);
  };

  module.exports = TupleType;
})();