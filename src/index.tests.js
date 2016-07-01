'use strict';

var _jsonc = require('./jsonc');

var _jsonc2 = _interopRequireDefault(_jsonc);

var _index = require('./index');

var _exports = _interopRequireWildcard(_index);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('index', () => {

  it('should export a Jsonc instance', () => {
    _exports.default.should.be.instanceof(_jsonc2.default);
  });

  it('should export the serializable annotation', () => {
    _exports.should.have.property('serializable');
  });
});

//# sourceMappingURL=index.tests.js.map