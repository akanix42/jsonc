"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Jsonc = class Jsonc {
  constructor() {
    this.registry = {};
    this.fnRegistry = new Map();
    this.fnReverseRegistry = new Map();
  }

  register(type, typeName, options) {
    typeName = typeName || type.__type__;
    if (!typeName) {
      console.error("Error registering type: no typename specified!");
      return;
    }

    if (this.hasTypeName(typeName)) {
      console.error(`Error registering type: ${ typeName } is already registered by ${ this.registry[typeName].type.toString() }!`, type);
      return;
    }

    this.registry[typeName] = { type, options };
    type.__type__ = typeName;
  }

  registerFunction(fn, type, key) {
    const combinedKey = `${ type.__type__ }.${ key }`;
    this.fnRegistry.set(fn, combinedKey);
    this.fnReverseRegistry.set(combinedKey, fn);
  }

  hasType(type) {
    return '__type__' in type && type.__type__ !== undefined && this.hasTypeName(type.__type__);
  }

  hasTypeName(typeName) {
    return typeName in this.registry;
  }

  getOptions(typeName) {
    const registration = this.registry[typeName];
    if (!registration) return {};

    let options;
    const parentTypeName = registration.type.__proto__.__type__;
    if (parentTypeName) options = _lodash2.default.merge(this.getOptions(parentTypeName), registration.options);else options = registration.options;
    return options;
  }

  stringify(data) {
    return _json2.default.stringify(this.serialize(data));
  }

  parse(json) {
    return this.deserialize(_json2.default.parse(json));
  }

  serialize(data) {
    return new _serializer2.default(this).serialize(data);
  }

  deserialize(data) {
    return new _deserializer2.default(this).deserialize(data);
  }
};
exports.default = Jsonc;

//# sourceMappingURL=jsonc.js.map