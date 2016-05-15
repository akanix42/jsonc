"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jsonc = function () {
  function Jsonc() {
    _classCallCheck(this, Jsonc);

    this.registry = {};
  }

  _createClass(Jsonc, [{
    key: 'register',
    value: function register(type, typeName, options) {
      typeName = typeName || type.__type__;
      if (!typeName) {
        console.error("Error registering type: no typename specified!");
        return;
      }

      if (this.hasTypeName(typeName)) {
        console.error('Error registering type: ' + typeName + ' is already registered by ' + this.registry[typeName].type.toString() + '!', type);
        return;
      }

      this.registry[typeName] = { type: type, options: options };
      type.__type__ = typeName;
    }
  }, {
    key: 'hasType',
    value: function hasType(type) {
      return '__type__' in type && type.__type__ !== undefined && this.hasTypeName(type.__type__);
    }
  }, {
    key: 'hasTypeName',
    value: function hasTypeName(typeName) {
      return typeName in this.registry;
    }
  }, {
    key: 'stringify',
    value: function stringify(data) {
      return _json2.default.stringify(this.serialize(data));
    }
  }, {
    key: 'parse',
    value: function parse(json) {
      return this.deserialize(_json2.default.parse(json));
    }
  }, {
    key: 'serialize',
    value: function serialize(data) {
      return new _serializer2.default(this).serialize(data);
    }
  }, {
    key: 'deserialize',
    value: function deserialize(data) {
      return new _deserializer2.default(this).deserialize(data);
    }
  }]);

  return Jsonc;
}();

exports.default = Jsonc;

//# sourceMappingURL=jsonc.js.map