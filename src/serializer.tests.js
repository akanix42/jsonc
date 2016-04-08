'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp = _class = function TestClass() {
        _classCallCheck(this, TestClass);

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
        } };
      var serializer = new _serializer2.default(mockJsonc);
      var TestClass = (_temp2 = _class2 = function () {
        function TestClass() {
          _classCallCheck(this, TestClass);
        }

        _createClass(TestClass, [{
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
      var obj = _defineProperty({}, _serializer2.default.Symbols.Serialize, function () {
        return { test: '123' };
      });
      var output = _json2.default.stringify(serializer.serialize({ obj: obj }));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{test:"123"}}],root:{obj:{__index__:0}}}');
    });
  });
});

//# sourceMappingURL=serializer.tests.js.map