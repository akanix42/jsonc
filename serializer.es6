"use strict";
import _ from 'lodash';

export default class Serializer {
  static Symbols = {Serialize: Symbol()};

  _instancesMap = new Map();
  _instances = [];

  constructor(jsonc) {
    this.jsonc = jsonc;
  }

  serialize(data) {
    this.data = data;
    return {
      instances: this._instances,
      root: this._map(this.data)
    };
  }

  convertRegisteredTypeToDto(obj) {
    var reference = this._getInstance(obj);
    if (reference)
      return reference;

    var instance = {
      __type__: obj.constructor.__type__
    };

    reference = this._addInstance(obj, instance);

    const data = Serializer.Symbols.Serialize in obj
      ? obj[Serializer.Symbols.Serialize]()
      : obj;

    instance.__value__ = this._map(data);
    return reference;
  }

  convertPlainObjectToDto(obj) {
    var reference = this._getInstance(obj);
    if (reference)
      return reference;

    var instance = {
      __type__: "__object__"
    };
    reference = this._addInstance(obj, instance);

    const data = Serializer.Symbols.Serialize in obj
      ? obj[Serializer.Symbols.Serialize]()
      : obj;

    instance.__value__ = this._map(data);

    return reference;
  }

  convertNativeTypeToDto(obj) {
    var reference = this._getInstance(obj);
    if (reference)
      return reference;

    var instance = {
      __type__: "__array__"
    };
    reference = this._addInstance(obj, instance);

    instance.__value__ = this._map(obj);

    return reference;
  }

  isSerializableObject(obj) {
    if (obj === null || obj === undefined)
      return false;

    var constructor = obj.constructor;
    return (this.jsonc.hasType(constructor))
      || constructor === Object
      || constructor === Array;
  }

  _addInstance(originalObject, instance) {
    if (this._instancesMap.get(originalObject))
      return;
    var reference = {__index__: this._instances.length};
    this._instances.push(instance);
    this._instancesMap.set(originalObject, reference);
    return reference;
  }

  _map(obj) {
    if (obj instanceof Array)
      return _.map(obj, this._mapValue.bind(this), this);
    else
      return _.mapValues(obj, this._mapValue.bind(this), this);
  }

  _mapValue(value) {
    var typeCategory = getTypeCategory(value);
    if (typeCategory === "primitive")
      return value;
    if (typeCategory === "object")
      return this._mapObject(value);

    function getTypeCategory(value) {
      var type = typeof value;
      if (type === "function" || (value !== null && type === "object"))
        return type;
      return "primitive";
    }
  }

  _mapObject(obj) {
    if (!this.isSerializableObject(obj)) {
      console.warn(`Object ${JSON.stringify(obj)} of constructor ${obj.constructor.toString()} is not a serializable object and will NOT be recorded!`);
      return null;
    }

    if (obj.constructor.__type__)
      return this.convertRegisteredTypeToDto(obj);

    if (obj.constructor === Object)
      return this.convertPlainObjectToDto(obj);

    return this.convertNativeTypeToDto(obj);
  }

  _getInstance(instance) {
    return this._instancesMap.get(instance);
  }
}