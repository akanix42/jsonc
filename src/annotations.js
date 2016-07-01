'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializable = serializable;
exports.include = include;
let jsonc;

function serializable(typeName, options) {
  if (!typeName) throw new Error('type name must be supplied');
  if (!options) options = {};

  return function (target) {
    if (typeName && typeof typeName !== 'string' && target === undefined) throw new Error('type name must be supplied');
    jsonc.register(target, typeName, options);
  };
}

function include(target, key, descriptor) {
  const fn = descriptor.value;
  jsonc.registerFunction(fn, target, key);

  return descriptor;
}

const _exports = { serializable, include };
function setJsonc(val) {
  jsonc = val;
  return _exports;
}

exports.default = setJsonc;

//# sourceMappingURL=annotations.js.map