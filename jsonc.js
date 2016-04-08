"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _serializer = require('./serializer');

var _deserializer = require('./deserializer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jsonc = function () {
  function Jsonc() {
    _classCallCheck(this, Jsonc);

    this.registry = {};
  }

  _createClass(Jsonc, [{
    key: 'register',
    value: function register(type) {
      if (!type.__type__) {
        console.error("Error registering type: no typename specified!");
        return;
      }

      if (this.hasType(type.__type__)) {
        console.error('Error registering type: ' + typeName + ' is already registered by ' + this.registry[type.typeName].toString() + '!', type);
        return;
      }

      this.registry[type.__type__] = type;
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
      return _json2.default.stringify(this.encode(data));
    }
  }, {
    key: 'parse',
    value: function parse(json) {
      return this.decode(_json2.default.parse(json));
    }
  }, {
    key: 'serialize',
    value: function serialize(data) {
      return new _serializer.Serializer().serialize(data);
    }
  }, {
    key: 'deserialize',
    value: function deserialize(data) {
      return new _deserializer.Deserializer().deserialize(data);
    }
  }]);

  return Jsonc;
}();

exports.default = Jsonc;

//# sourceMappingURL=jsonc.js.map