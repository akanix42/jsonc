'use strict';
import _ from 'lodash';
import autobind from 'autobind-decorator'

export default class Deserializer {
  static Symbols = {PostProcess: Symbol()};

  data = null;
  instances = null;
  objectsToPostProcess = [];

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
    const isNativeType = (obj) => '__type__' in obj && (obj.__type__ === '__object__' || obj.__type__ === '__array__');

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
      var instance = new this.jsonc.registry[obj.__type__]();
      if (instance[Deserializer.Symbols.PostProcess])
        this.objectsToPostProcess.push(instance);
      return _.assign(instance, obj.__value__);
    }

    function instantiateNativeType(obj) {
      var instance = obj.__type__ === '__object__'
        ? {}
        : [];
      return _.assign(instance, obj.__value__);
    }
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

    _.forOwn(obj, this._restoreProperty);
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
