'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializable = undefined;

require('babel-polyfill');

var _annotations = require('./annotations');

var _annotations2 = _interopRequireDefault(_annotations);

var _jsonc = require('./jsonc');

var _jsonc2 = _interopRequireDefault(_jsonc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonc = new _jsonc2.default();
exports.default = jsonc;

var annotations = new _annotations2.default(jsonc);
var serializable = annotations.serializable;
exports.serializable = serializable;

//# sourceMappingURL=index.js.map