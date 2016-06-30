'use strict';
import _ from 'lodash';
import autobind from 'autobind-decorator'

export default class Deserializer {
  static Symbols = {PostProcess: Symbol()};

  data = null;
  instances = null;
  objectsToPostProcess = [];
  _nativeTypeMap = new Map([
    ['__object__', this.convertDtoToNativeObject.bind(this)],
    ['__array__', this.convertDtoToNativeArray.bind(this)],
    ['__native_map__', this.convertDtoToNativeMap.bind(this)],
    ['__native_set__', this.convertDtoToNativeSet.bind(this)],
  ]);

  constructor(jsonc) {
    this.jsonc = jsonc;
  }

  deserialize(data) {
    this.data = data;
    this.instances = this._map(this.data.instances, this._instantiateValue);

    _.forEach(this.instances, this._restoreProperties);
    this._restoreProperties(this.data.root);
    _.forEach(this.objectsToPostProcess, this._postProcess);

    return this.data.root;
  }

  @autobind
  _map(obj, fn) {
    if (obj instanceof Array)
      return _.map(obj, fn, this);
    else
      return _.mapValues(obj, fn, this);
  }

  @autobind
  _instantiateValue(value) {
    const isRegisteredType = (obj) => '__type__' in obj && obj.__type__ && this.jsonc.hasTypeName(obj.__type__);
    const isNativeType = (obj) => '__type__' in obj && this._nativeTypeMap.has(obj.__type__);

    const typeCategory = this._getTypeCategory(value);
    if (typeCategory === 'function')
      return undefined;

    if (typeCategory === 'primitive')
      return value;

    if (isRegisteredType(value))
      return instantiateRegisteredType.call(this, value);

    if (isNativeType(value))
      return instantiateNativeType.call(this, value);

    return value;


    function instantiateRegisteredType(obj) {
      var instance = new this.jsonc.registry[obj.__type__].type();
      if (instance[Deserializer.Symbols.PostProcess])
        this.objectsToPostProcess.push(instance);
      return _.assign(instance, obj.__value__);
    }

    function instantiateNativeType(obj) {
      return this._nativeTypeMap.get(obj.__type__)(obj);
    }

  }

  convertDtoToNativeObject(obj) {
    return _.assign({}, obj.__value__);
  }

  convertDtoToNativeArray(obj) {
    return _.assign([], obj.__value__);
  }

  convertDtoToNativeMap(obj) {
    return new Map([obj.__value__]);
  }

  convertDtoToNativeSet(obj) {
    return new Set(obj.__value__);
  }

  @autobind
  _getTypeCategory(value) {
    const type = typeof value;
    if (type === 'function' || (value !== null && type === 'object'))
      return type;
    return 'primitive';
  }

  @autobind
  _restoreProperties(obj) {
    const typeCategory = this._getTypeCategory(obj);
    if (typeCategory !== 'object')
      return;
    if (obj instanceof Map)
      this._restoreMapPairs(obj);
    else
      _.forOwn(obj, this._restoreProperty);
  }

  _restoreMapPairs(obj) {
    const keys = [...obj.keys()];
    keys.forEach(key=> {
      obj.delete(key);
      const instance = this.instances[key.__index__];
      obj.set(instance[0], instance[1]);
    });
  }

  @autobind
  _restoreProperty(value, key, obj) {
    const isReference = (obj) => '__index__' in obj;
    const typeCategory = this._getTypeCategory(value);
    if (typeCategory !== 'object')
      return;

    if (isReference(value))
      obj[key] = this.instances[value.__index__];
  }

  @autobind
  _postProcess(obj) {
    obj[Deserializer.Symbols.PostProcess]();
  }
}
