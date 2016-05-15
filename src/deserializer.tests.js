'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireDefault(_chaiThings);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.should();
_chai2.default.use(_chaiThings2.default);

describe('Deserializer', function () {
  describe('.deserialize()', function () {

    it('deserializes empty objects', function () {
      var deserializer = new _deserializer2.default();
      var input = { instances: [], root: {} };
      var output = deserializer.deserialize(input);

      output.should.eql({});
    });

    it('deserializes string properties', function () {
      var deserializer = new _deserializer2.default();
      var input = { instances: [], root: { a: 'test' } };
      var output = deserializer.deserialize(input);

      output.should.eql({ a: 'test' });
    });

    it('deserializes boolean properties', function () {
      var deserializer = new _deserializer2.default();
      var input = { instances: [], root: { a: true } };
      var output = deserializer.deserialize(input);

      output.should.eql({ a: true });
    });

    it('deserializes number properties', function () {
      var deserializer = new _deserializer2.default();
      var input = { instances: [], root: { a: 1 } };
      var output = deserializer.deserialize(input);

      output.should.eql({ a: 1 });
    });

    it('deserializes an array', function () {
      var deserializer = new _deserializer2.default();
      var input = { instances: [], root: [1, 2] };
      var output = deserializer.deserialize(input);

      output.should.eql([1, 2]);
    });

    it('deserializes nested objects', function () {
      var mockJsonc = { hasTypeName: function hasTypeName() {
          return false;
        } };
      var deserializer = new _deserializer2.default(mockJsonc);
      var input = { instances: [{ __type__: "__object__", __value__: { c: "test" } }], root: { a: 1, b: { __index__: 0 } } };
      var output = deserializer.deserialize(input);

      output.should.eql({ a: 1, b: { c: 'test' } });
    });

    it('deserializes object references to the same object instance', function () {
      var mockJsonc = { hasTypeName: function hasTypeName() {
          return false;
        } };
      var deserializer = new _deserializer2.default(mockJsonc);
      var input = {
        instances: [{ __type__: "__object__", __value__: {} }],
        root: [{ __index__: 0 }, { __index__: 0 }, { __index__: 0 }]
      };
      var output = deserializer.deserialize(input);

      var obj = output[0];
      output.should.all.equal(obj);
    });

    it('deserializes registered types', function () {
      var _class, _temp;

      var TestClass = (_temp = _class = function TestClass() {
        _classCallCheck(this, TestClass);

        this.test = '123';
      }, _class.__type__ = 'test', _temp);


      var mockJsonc = { hasTypeName: function hasTypeName() {
          return true;
        }, registry: { test: { type: TestClass } } };
      var deserializer = new _deserializer2.default(mockJsonc);
      var input = { instances: [{ __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      var output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(TestClass);
    });

    it('allows post-processing of registered types via the Deserializer.Symbols.PostProcess property', function () {
      var _class2, _temp2;

      var TestClass = (_temp2 = _class2 = function () {
        function TestClass() {
          _classCallCheck(this, TestClass);

          this.test = '123';
        }

        _createClass(TestClass, [{
          key: _deserializer2.default.Symbols.PostProcess,
          value: function value() {
            this.test = 'cats!';
          }
        }]);

        return TestClass;
      }(), _class2.__type__ = 'test', _temp2);


      var mockJsonc = { hasTypeName: function hasTypeName() {
          return true;
        }, registry: { test: { type: TestClass } } };
      var deserializer = new _deserializer2.default(mockJsonc);
      var input = { instances: [{ __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      var output = deserializer.deserialize(input);

      output[0].test.should.equal('cats!');
    });
  });
});

//# sourceMappingURL=deserializer.tests.js.map