'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Deserializer = function () {
  function Deserializer(jsonc) {
    _classCallCheck(this, Deserializer);

    this.data = null;
    this.instances = null;
    this.objectsToPostProcess = [];

    this.jsonc = jsonc;
  }

  _createClass(Deserializer, [{
    key: 'deserialize',
    value: function deserialize(data) {
      this.data = data;
      this.instances = this._map(this.data.instances, this._instantiateValue);

      _lodash2.default.forEach(this.instances, this._restoreProperties, this);
      this._restoreProperties(this.data.root);
      _lodash2.default.forEach(this.objectsToPostProcess, this._postProcess, this);

      return this.data.root;
    }
  }, {
    key: '_map',
    value: function _map(obj, fn) {
      if (obj instanceof Array) return _lodash2.default.map(obj, fn, this);else return _lodash2.default.mapValues(obj, fn, this);
    }
  }, {
    key: '_instantiateValue',
    value: function _instantiateValue(value) {
      var _this = this;

      var isRegisteredType = function isRegisteredType(obj) {
        return '__type__' in obj && obj.__type__ && _this.jsonc.hasTypeName(obj.__type__);
      };
      var isNativeType = function isNativeType(obj) {
        return '__type__' in obj && (obj.__type__ === '__object__' || obj.__type__ === '__array__');
      };

      var typeCategory = this._getTypeCategory(value);
      if (typeCategory === 'function') return undefined;

      if (typeCategory === 'primitive') return value;

      if (isRegisteredType(value)) return instantiateRegisteredType.call(this, value);

      if (isNativeType(value)) return instantiateNativeType.call(this, value);

      return value;

      function instantiateRegisteredType(obj) {
        var instance = new this.jsonc.registry[obj.__type__]();
        if (instance[Deserializer.Symbols.PostProcess]) this.objectsToPostProcess.push(instance);
        return _lodash2.default.assign(instance, obj.__value__);
      }

      function instantiateNativeType(obj) {
        var instance = obj.__type__ === '__object__' ? {} : [];
        return _lodash2.default.assign(instance, obj.__value__);
      }
    }
  }, {
    key: '_getTypeCategory',
    value: function _getTypeCategory(value) {
      var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
      if (type === 'function' || value !== null && type === 'object') return type;
      return 'primitive';
    }
  }, {
    key: '_restoreProperties',
    value: function _restoreProperties(obj) {
      var typeCategory = this._getTypeCategory(obj);
      if (typeCategory !== 'object') return;

      _lodash2.default.forOwn(obj, this._restoreProperty, this);
    }
  }, {
    key: '_restoreProperty',
    value: function _restoreProperty(value, key, obj) {
      var isReference = function isReference(obj) {
        return '__index__' in obj;
      };
      var typeCategory = this._getTypeCategory(value);
      if (typeCategory !== 'object') return;

      if (isReference(value)) obj[key] = this.instances[value.__index__];
    }
  }, {
    key: '_postProcess',
    value: function _postProcess(obj) {
      obj[Deserializer.Symbols.PostProcess]();
    }
  }]);

  return Deserializer;
}();

Deserializer.Symbols = { PostProcess: Symbol() };
exports.default = Deserializer;

//# sourceMappingURL=deserializer.js.map