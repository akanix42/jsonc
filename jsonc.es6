"use strict";
import json5 from 'json5';
import { Serializer } from './serializer';
import { Deserializer } from './deserializer';

export default class Jsonc {
  registry = {};

  register(type) {
    if (!type.__type__) {
      console.error("Error registering type: no typename specified!");
      return;
    }

    if (this.hasType(type.__type__)) {
      console.error(`Error registering type: ${typeName} is already registered by ${this.registry[type.typeName].toString()}!`, type);
      return;
    }

    this.registry[type.__type__] = type;
  }

  hasType(type) {
    return '__type__' in type && type.__type__ !== undefined && this.hasTypeName(type.__type__);
  }

  hasTypeName(typeName) {
    return typeName in this.registry;
  }

  stringify(data) {
    return json5.stringify(this.encode(data));
  }

  parse(json) {
    return this.decode(json5.parse(json));
  }

  serialize(data) {
    return new Serializer().serialize(data);
  }

  deserialize(data) {
    return new Deserializer().deserialize(data);
  }
}