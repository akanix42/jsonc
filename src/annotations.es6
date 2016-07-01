let jsonc;

export function serializable(typeName, options) {
  if (!typeName)
    throw new Error('type name must be supplied');
  if (!options)
    options = {};

  return function (target) {
    if (typeName && typeof typeName !== 'string' && target === undefined)
      throw new Error('type name must be supplied');
    jsonc.register(target, typeName, options);
  };
}

export function include(target, key, descriptor) {
  const fn = descriptor.value;
  jsonc.registerFunction(fn, target, key);

  return descriptor;
}

const exports = {serializable, include};
function setJsonc(val) {
  jsonc = val;
  return exports;
}

export default setJsonc ;
