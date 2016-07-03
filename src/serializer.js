"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _desc, _value, _class, _class2, _temp;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

let Serializer = (_class = (_temp = _class2 = class Serializer {

  constructor(jsonc) {
    this._nativeTypeMap = new Map([[Array, this.convertNativeArrayToDto.bind(this)], [Map, this.convertNativeMapToDto.bind(this)], [Set, this.convertNativeSetToDto.bind(this)]]);
    this._instancesMap = new Map();
    this._instances = [];

    this.jsonc = jsonc;
  }

  serialize(data) {
    this.data = [data];
    return {
      instances: this._instances,
      root: this._map(this.data)
    };
  }

  convertRegisteredTypeToDto(obj) {
    var reference = this._getInstance(obj);
    if (reference) return reference;

    var instance = {
      __type__: obj.constructor.__type__
    };

    reference = this._addInstance(obj, instance);

    const data = Serializer.Symbols.Serialize in obj ? obj[Serializer.Symbols.Serialize]() : obj;

    const options = this.jsonc.getOptions(instance.__type__);
    instance.__value__ = this._map(data, options);

    return reference;
  }

  convertPlainObjectToDto(obj) {
    var reference = this._getInstance(obj);
    if (reference) return reference;

    var instance = {
      __type__: "__object__"
    };
    reference = this._addInstance(obj, instance);

    const data = Serializer.Symbols.Serialize in obj ? obj[Serializer.Symbols.Serialize]() : obj;

    instance.__value__ = this._map(data);

    return reference;
  }

  convertNativeTypeToDto(obj) {
    let reference = this._getInstance(obj);
    if (reference) return reference;

    const convertToDto = this._nativeTypeMap.get(obj.constructor);
    return convertToDto(obj);
  }

  convertNativeArrayToDto(obj) {
    var instance = {
      __type__: "__array__"
    };
    const reference = this._addInstance(obj, instance);
    instance.__value__ = this._map(obj);

    return reference;
  }

  convertNativeMapToDto(obj) {
    var instance = {
      __type__: "__native_map__"
    };
    const reference = this._addInstance(obj, instance);
    const items = [...obj].map(item => this._map(item));

    instance.__value__ = items;

    return reference;
  }

  convertNativeSetToDto(obj) {
    var instance = {
      __type__: "__native_set__"
    };
    const reference = this._addInstance(obj, instance);
    instance.__value__ = this._map([...obj]);

    return reference;
  }

  isSerializableObject(obj) {
    if (obj === null || obj === undefined) return false;

    var constructor = obj.constructor;
    return this.jsonc.hasType(constructor) || constructor === Object || this._nativeTypeMap.has(constructor);
  }

  _addInstance(originalObject, instance) {
    if (this._instancesMap.get(originalObject)) return;
    var reference = { __index__: this._instances.length };
    this._instances.push(instance);
    this._instancesMap.set(originalObject, reference);
    return reference;
  }

  _map(obj, options) {
    if (obj instanceof Array) {
      const props = Object.keys(obj).filter(key => key.match(/^\D+$/));
      const array = _lodash2.default.map(obj, this._mapValue);
      if (props && props.length) return { __array__: array, __props__: mapObject.call(this, _lodash2.default.pick(obj, props)) };
      return array;
    } else {
      return mapObject.call(this, obj);
    }

    function mapObject(obj) {
      if (options) {
        if (options.exclude) obj = _lodash2.default.omit(obj, options.exclude);
        if (options.include) obj = _lodash2.default.pick(obj, options.include);
      }
      return _lodash2.default.mapValues(obj, this._mapValue);
    }
  }

  _mapValue(value) {
    var typeCategory = getTypeCategory(value);
    if (typeCategory === "primitive") return value;
    if (typeCategory === "object") return this._mapObject(value);
    if (typeCategory === 'function') return this._mapFunction(value);

    function getTypeCategory(value) {
      var type = typeof value;
      if (type === 'function' || value !== null && type === 'object') return type;
      return 'primitive';
    }
  }

  _mapObject(obj) {
    if (!this.isSerializableObject(obj)) {
      console.warn(`The following object of constructor ${ obj.constructor.toString() } is not a serializable object and will NOT be recorded!`);
      console.dir(obj);
      return null;
    }

    if (obj.constructor.__type__) return this.convertRegisteredTypeToDto(obj);

    if (obj.constructor === Object) return this.convertPlainObjectToDto(obj);

    return this.convertNativeTypeToDto(obj);
  }

  _mapFunction(fn) {
    const key = this.jsonc.fnRegistry.get(fn);
    if (!key) {
      console.warn(`function ${ fn.name } not found; the reference will not be saved.`);
      return;
    }

    return { __fn__: key };
  }

  _getInstance(instance) {
    return this._instancesMap.get(instance);
  }
}, _class2.Symbols = { Serialize: Symbol() }, _temp), (_applyDecoratedDescriptor(_class.prototype, '_addInstance', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_addInstance'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_map', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_map'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_mapValue', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_mapValue'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_mapObject', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_mapObject'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_mapFunction', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_mapFunction'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_getInstance', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_getInstance'), _class.prototype)), _class);
exports.default = Serializer;

//# sourceMappingURL=serializer.js.map