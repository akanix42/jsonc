"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Serializer = function () {
  function Serializer(jsonc) {
    _classCallCheck(this, Serializer);

    this._instancesMap = new Map();
    this._instances = [];

    this.jsonc = jsonc;
  }

  _createClass(Serializer, [{
    key: "serialize",
    value: function serialize(data) {
      this.data = data;
      return {
        instances: this._instances,
        root: this._map(this.data)
      };
    }
  }, {
    key: "convertRegisteredTypeToDto",
    value: function convertRegisteredTypeToDto(obj) {
      var reference = this._getInstance(obj);
      if (reference) return reference;

      var instance = {
        __type__: obj.constructor.__type__
      };

      reference = this._addInstance(obj, instance);

      var data = Serializer.Symbols.Serialize in obj ? obj[Serializer.Symbols.Serialize]() : obj;

      instance.__value__ = this._map(data);
      return reference;
    }
  }, {
    key: "convertPlainObjectToDto",
    value: function convertPlainObjectToDto(obj) {
      var reference = this._getInstance(obj);
      if (reference) return reference;

      var instance = {
        __type__: "__object__"
      };
      reference = this._addInstance(obj, instance);

      var data = Serializer.Symbols.Serialize in obj ? obj[Serializer.Symbols.Serialize]() : obj;

      instance.__value__ = this._map(data);

      return reference;
    }
  }, {
    key: "convertNativeTypeToDto",
    value: function convertNativeTypeToDto(obj) {
      var reference = this._getInstance(obj);
      if (reference) return reference;

      var instance = {
        __type__: "__array__"
      };
      reference = this._addInstance(obj, instance);

      instance.__value__ = this._map(obj);

      return reference;
    }
  }, {
    key: "isSerializableObject",
    value: function isSerializableObject(obj) {
      if (obj === null || obj === undefined) return false;

      var constructor = obj.constructor;
      return this.jsonc.hasType(constructor) || constructor === Object || constructor === Array;
    }
  }, {
    key: "_addInstance",
    value: function _addInstance(originalObject, instance) {
      if (this._instancesMap.get(originalObject)) return;
      var reference = { __index__: this._instances.length };
      this._instances.push(instance);
      this._instancesMap.set(originalObject, reference);
      return reference;
    }
  }, {
    key: "_map",
    value: function _map(obj) {
      if (obj instanceof Array) return _lodash2.default.map(obj, this._mapValue.bind(this), this);else return _lodash2.default.mapValues(obj, this._mapValue.bind(this), this);
    }
  }, {
    key: "_mapValue",
    value: function _mapValue(value) {
      var typeCategory = getTypeCategory(value);
      if (typeCategory === "primitive") return value;
      if (typeCategory === "object") return this._mapObject(value);

      function getTypeCategory(value) {
        var type = typeof value === "undefined" ? "undefined" : _typeof(value);
        if (type === "function" || value !== null && type === "object") return type;
        return "primitive";
      }
    }
  }, {
    key: "_mapObject",
    value: function _mapObject(obj) {
      if (!this.isSerializableObject(obj)) {
        console.warn("Object " + JSON.stringify(obj) + " of constructor " + obj.constructor.toString() + " is not a serializable object and will NOT be recorded!");
        return null;
      }

      if (obj.constructor.__type__) return this.convertRegisteredTypeToDto(obj);

      if (obj.constructor === Object) return this.convertPlainObjectToDto(obj);

      return this.convertNativeTypeToDto(obj);
    }
  }, {
    key: "_getInstance",
    value: function _getInstance(instance) {
      return this._instancesMap.get(instance);
    }
  }]);

  return Serializer;
}();

Serializer.Symbols = { Serialize: Symbol() };
exports.default = Serializer;

//# sourceMappingURL=serializer.js.map