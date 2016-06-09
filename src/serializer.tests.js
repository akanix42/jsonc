'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Serializer', function () {
  describe('.serialize()', function () {

    it('serializes empty objects', function () {
      var serializer = new _serializer2.default();
      var output = _json2.default.stringify(serializer.serialize({}));

      output.should.equal('{instances:[],root:{}}');
    });

    it('serializes string properties', function () {
      var serializer = new _serializer2.default();
      var output = _json2.default.stringify(serializer.serialize({ a: 'test' }));

      output.should.equal('{instances:[],root:{a:"test"}}');
    });

    it('serializes boolean properties', function () {
      var serializer = new _serializer2.default();
      var output = _json2.default.stringify(serializer.serialize({ a: true }));

      output.should.equal('{instances:[],root:{a:true}}');
    });

    it('serializes number properties', function () {
      var serializer = new _serializer2.default();
      var output = _json2.default.stringify(serializer.serialize({ a: 1 }));

      output.should.equal('{instances:[],root:{a:1}}');
    });

    it('serializes an array', function () {
      var serializer = new _serializer2.default();
      var output = _json2.default.stringify(serializer.serialize([1, 2]));

      output.should.equal('{instances:[],root:[1,2]}');
    });

    it('serializes nested objects', function () {
      var mockJsonc = { hasType: function hasType() {
          return false;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var obj = { a: 1, b: { c: 'test' } };
      var output = _json2.default.stringify(serializer.serialize(obj));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{c:"test"}}],root:{a:1,b:{__index__:0}}}');
    });

    it('serializes registered types', function () {
      var _class, _temp;

      var mockJsonc = { hasType: function hasType() {
          return true;
        }, registry: { 'test': {} }, getOptions: function getOptions() {
          return null;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp = _class = function TestClass() {
        (0, _classCallCheck3.default)(this, TestClass);
        this.test = '123';
      }, _class.__type__ = 'test', _temp);

      var obj = new TestClass();
      var output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('stores references to an object instead of multiple copies', function () {
      var mockJsonc = { hasType: function hasType() {
          return false;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var obj = {};
      var output = _json2.default.stringify(serializer.serialize([obj, obj, obj]));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{}}],root:[{__index__:0},{__index__:0},{__index__:0}]}');
    });

    it('allows serialization overriding of registered types via the Serializer.Symbols.Serialize property', function () {
      var _class2, _temp2;

      var mockJsonc = { hasType: function hasType() {
          return true;
        }, registry: { 'test': {} }, getOptions: function getOptions() {
          return null;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp2 = _class2 = function () {
        function TestClass() {
          (0, _classCallCheck3.default)(this, TestClass);
        }

        (0, _createClass3.default)(TestClass, [{
          key: _serializer2.default.Symbols.Serialize,
          value: function value() {
            return { test: '123' };
          }
        }]);
        return TestClass;
      }(), _class2.__type__ = 'test', _temp2);

      var obj = new TestClass();
      var output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('allows serialization overriding of plain objects via the Serializer.Symbols.Serialize property', function () {
      var mockJsonc = { hasType: function hasType() {
          return false;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var obj = (0, _defineProperty3.default)({}, _serializer2.default.Symbols.Serialize, function () {
        return { test: '123' };
      });
      var output = _json2.default.stringify(serializer.serialize({ obj: obj }));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{test:"123"}}],root:{obj:{__index__:0}}}');
    });

    it('allows excluding specified properties from serialization', function () {
      var _class3, _temp3;

      var serializationOptions = { exclude: ['test'] };
      var mockJsonc = { hasType: function hasType() {
          return true;
        }, getOptions: function getOptions() {
          return serializationOptions;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp3 = _class3 = function TestClass() {
        (0, _classCallCheck3.default)(this, TestClass);
        this.test = '123';
      }, _class3.__type__ = 'test', _temp3);

      var obj = new TestClass();
      var output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{}}],root:[{__index__:0}]}');
    });

    it('allows including only specified properties in serialization', function () {
      var _class4, _temp4;

      var serializationOptions = { include: ['test2'] };
      var mockJsonc = { hasType: function hasType() {
          return true;
        }, getOptions: function getOptions() {
          return serializationOptions;
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp4 = _class4 = function TestClass() {
        (0, _classCallCheck3.default)(this, TestClass);
        this.test = '123';
        this.test2 = '123';
      }, _class4.__type__ = 'test', _temp4);

      var obj = new TestClass();
      var output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test2:"123"}}],root:[{__index__:0}]}');
    });
  });
});

//# sourceMappingURL=serializer.tests.js.map