"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Jsonc = function () {
  function Jsonc() {
    (0, _classCallCheck3.default)(this, Jsonc);
    this.registry = {};
  }

  (0, _createClass3.default)(Jsonc, [{
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
    key: 'getOptions',
    value: function getOptions(typeName) {
      var registration = this.registry[typeName];
      if (!registration) return {};

      var options = void 0;
      var parentTypeName = registration.type.__proto__.__type__;
      if (parentTypeName) options = _lodash2.default.merge(this.getOptions(parentTypeName), registration.options);else options = registration.options;
      return options;
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