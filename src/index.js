'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deserializer = undefined;

var _annotations = require('./annotations');

Object.keys(_annotations).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _annotations[key];
    }
  });
});

var _deserializer = require('./deserializer');

Object.defineProperty(exports, 'Deserializer', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_deserializer).default;
  }
});

var _annotations2 = _interopRequireDefault(_annotations);

var _jsonc = require('./jsonc');

var _jsonc2 = _interopRequireDefault(_jsonc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jsonc = new _jsonc2.default();
exports.default = jsonc;

(0, _annotations2.default)(jsonc);

//# sourceMappingURL=index.js.map