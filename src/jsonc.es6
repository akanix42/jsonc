"use strict";
import json5 from 'json5';
import _ from 'lodash';
import Serializer from './serializer';
import Deserializer from './deserializer';

export default class Jsonc {
  registry = {};
  fnRegistry = new Map();
  fnReverseRegistry = new Map();

  register(type, typeName, options) {
    typeName = typeName || type.__type__;
    if (!typeName) {
      console.error("Error registering type: no typename specified!");
      return;
    }

    if (this.hasTypeName(typeName)) {
      console.error(`Error registering type: ${typeName} is already registered by ${this.registry[typeName].type.toString()}!`, type);
      return;
    }

    this.registry[typeName] = {type, options};
    type.__type__ = typeName;

    Object
      .getOwnPropertyNames(type.prototype)
      .filter(key=> {
        let descriptor = Object.getOwnPropertyDescriptor(type.prototype, key);
        return key !== 'constructor' && descriptor.value && typeof descriptor.value === 'function'
      })
      .forEach(key=>this.registerFunction(type.prototype[key], type, key));
  }

  registerFunction(fn, type, key) {
    const combinedKey = `${type.__type__}.${key}`;
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
    if (!registration)
      return {};

    let options;
    const parentTypeName = registration.type.__proto__.__type__;
    if (parentTypeName)
      options = _.merge(this.getOptions(parentTypeName), registration.options);
    else
      options = registration.options;
    return options;
  }

  stringify(data) {
    return json5.stringify(this.serialize(data));
  }

  parse(json) {
    return this.deserialize(json5.parse(json));
  }

  serialize(data) {
    return new Serializer(this).serialize(data);
  }

  deserialize(data) {
    return new Deserializer(this).deserialize(data);
  }
}
