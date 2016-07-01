'use strict';

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

let Deserializer = (_class = (_temp = _class2 = class Deserializer {

  constructor(jsonc) {
    this.data = null;
    this.instances = null;
    this.objectsToPostProcess = [];
    this._nativeTypeMap = new Map([['__object__', this.convertDtoToNativeObject.bind(this)], ['__array__', this.convertDtoToNativeArray.bind(this)], ['__native_map__', this.convertDtoToNativeMap.bind(this)], ['__native_set__', this.convertDtoToNativeSet.bind(this)]]);

    this.jsonc = jsonc;
  }

  deserialize(data) {
    this.data = data;
    this.instances = this._map(this.data.instances, this._instantiateValue);

    _lodash2.default.forEach(this.instances, this._restoreProperties);
    this._restoreProperties(this.data.root);
    _lodash2.default.forEach(this.objectsToPostProcess, this._postProcess);

    return this.data.root[0];
  }

  _map(obj, fn) {
    if (obj instanceof Array) return _lodash2.default.map(obj, fn, this);else return _lodash2.default.mapValues(obj, fn, this);
  }

  _instantiateValue(value) {
    const isRegisteredType = obj => '__type__' in obj && obj.__type__ && this.jsonc.hasTypeName(obj.__type__);
    const isNativeType = obj => '__type__' in obj && this._nativeTypeMap.has(obj.__type__);

    const typeCategory = this._getTypeCategory(value);
    if (typeCategory === 'function') return undefined;

    if (typeCategory === 'primitive') return value;

    if (isRegisteredType(value)) return instantiateRegisteredType.call(this, value);

    if (isNativeType(value)) return instantiateNativeType.call(this, value);

    return value;

    function instantiateRegisteredType(obj) {
      var instance = new this.jsonc.registry[obj.__type__].type();
      if (instance[Deserializer.Symbols.PostProcess]) this.objectsToPostProcess.push(instance);
      return this.restoreInstance(instance, obj);
    }

    function instantiateNativeType(obj) {
      return this._nativeTypeMap.get(obj.__type__)(obj);
    }
  }

  convertDtoToNativeObject(obj) {
    return _lodash2.default.assign({}, obj.__value__);
  }

  convertDtoToNativeArray(obj) {
    return this.restoreInstance([], obj);
  }

  restoreInstance(instance, obj) {
    const data = obj.__value__.__array__ || obj.__value__;
    _lodash2.default.assign(instance, data);
    if (obj.__value__.__props__) _lodash2.default.assign(instance, obj.__value__.__props__);

    return instance;
  }

  convertDtoToNativeMap(obj) {
    return new Map([obj.__value__]);
  }

  convertDtoToNativeSet(obj) {
    return new Set(obj.__value__);
  }

  _getTypeCategory(value) {
    const type = typeof value;
    if (type === 'function' || value !== null && type === 'object') return type;
    return 'primitive';
  }

  _restoreProperties(obj) {
    const typeCategory = this._getTypeCategory(obj);
    if (typeCategory !== 'object') return;
    if (obj instanceof Map) this._restoreMapPairs(obj);else _lodash2.default.forOwn(obj, this._restoreProperty);
  }

  _restoreMapPairs(obj) {
    const keys = [...obj.keys()];
    keys.forEach(key => {
      obj.delete(key);
      const instance = this.instances[key.__index__];
      obj.set(instance[0], instance[1]);
    });
  }

  _restoreProperty(value, key, obj) {
    const isReference = obj => '__index__' in obj;
    const typeCategory = this._getTypeCategory(value);
    if (typeCategory !== 'object') return;

    if (isReference(value)) obj[key] = this.instances[value.__index__];
  }

  _postProcess(obj) {
    obj[Deserializer.Symbols.PostProcess]();
  }
}, _class2.Symbols = { PostProcess: Symbol() }, _temp), (_applyDecoratedDescriptor(_class.prototype, '_map', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_map'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_instantiateValue', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_instantiateValue'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_getTypeCategory', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_getTypeCategory'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_restoreProperties', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_restoreProperties'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_restoreProperty', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_restoreProperty'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '_postProcess', [_autobindDecorator2.default], Object.getOwnPropertyDescriptor(_class.prototype, '_postProcess'), _class.prototype)), _class);
exports.default = Deserializer;

//# sourceMappingURL=deserializer.js.map