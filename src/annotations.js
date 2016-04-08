'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = annotations;

require('babel-polyfill');

function annotations(jsonc) {
  return {
    serializable: function serializable(typeName) {
      if (!typeName) throw new Error('type name must be supplied');
      return function (target) {
        if (typeName && typeof typeName !== 'string' && target === undefined) throw new Error('type name must be supplied');
        jsonc.register(target, typeName);
      };
    }
  };
};

//# sourceMappingURL=annotations.js.map