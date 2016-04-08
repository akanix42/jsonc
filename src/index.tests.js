'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _jsonc = require('./jsonc');

var _jsonc2 = _interopRequireDefault(_jsonc);

var _index = require('./index');

var _exports = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('index', function () {

  it('should export a Jsonc instance', function () {
    _exports.default.should.be.instanceof(_jsonc2.default);
  });

  it('should export the serializable annotation', function () {
    _exports.should.have.property('serializable');
  });
});

//# sourceMappingURL=index.tests.js.map