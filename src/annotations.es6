import 'babel-polyfill';

export default function annotations(jsonc) {
  return {
    serializable(typeName, options) {
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
  };
};