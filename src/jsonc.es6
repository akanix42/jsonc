"use strict";
import json5 from 'json5';
import Serializer from './serializer';
import Deserializer from './deserializer';

export default class Jsonc {
  registry = {};

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

    this.registry[typeName] = { type, options };
    type.__type__ = typeName;
  }

  hasType(type) {
    return '__type__' in type && type.__type__ !== undefined && this.hasTypeName(type.__type__);
  }

  hasTypeName(typeName) {
    return typeName in this.registry;
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