'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireDefault(_chaiThings);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _jsonc = require('./jsonc');

var _jsonc2 = _interopRequireDefault(_jsonc);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.should();
_chai2.default.use(_chaiThings2.default);

describe("Jsonc", function () {
  describe('.hasType()', function () {

    it('returns false if the class type has not been registered', function () {
      var jsonc = new _jsonc2.default();
      jsonc.hasType({ __type__: 'test' }).should.be.false;
    });

    it('returns true if the class type has been registered', function () {
      var jsonc = new _jsonc2.default();
      jsonc.registry.test = 1;
      jsonc.hasType({ __type__: 'test' }).should.be.true;
    });
  });

  describe('.hasTypeName()', function () {

    it('returns false if the class type has not been registered', function () {
      var jsonc = new _jsonc2.default();
      jsonc.hasTypeName('test').should.be.false;
    });

    it('returns true if the class type has been registered', function () {
      var jsonc = new _jsonc2.default();
      jsonc.registry.test = 1;
      jsonc.hasTypeName('test').should.be.true;
    });
  });

  describe('.stringify()', function () {

    it('returns a serialized, stringified version of the supplied data', function () {
      var jsonc = new _jsonc2.default();
      jsonc.serialize = function (data) {
        return data;
      };
      var data = { test: 123 };
      jsonc.stringify(data).should.equal(_json2.default.stringify(data));
    });
  });

  describe('.parse()', function () {

    it('returns a deserialized version of the supplied JSON5', function () {
      var jsonc = new _jsonc2.default();
      jsonc.deserialize = function (data) {
        return data;
      };
      var data = { test: 123 };
      jsonc.parse(_json2.default.stringify(data)).should.eql(data);
    });
  });

  describe('.serialize()', function () {

    it('passes the call on to the Serializer class', function () {
      var oldSerialize = _serializer2.default.prototype.serialize;

      var testData = {};
      var wasCalledWithData = false;
      _serializer2.default.prototype.serialize = function (data) {
        return wasCalledWithData = testData === data;
      };
      var jsonc = new _jsonc2.default();
      jsonc.serialize(testData);
      wasCalledWithData.should.be.true;

      _serializer2.default.prototype.serialize = oldSerialize;
    });
  });

  describe(".deserialize()", function () {

    it('passes the call on to the Deserializer class', function () {
      var oldDeserialize = _deserializer2.default.prototype.deserialize;

      var testData = {};
      var wasCalledWithData = false;
      _deserializer2.default.prototype.deserialize = function (data) {
        return wasCalledWithData = testData === data;
      };
      var jsonc = new _jsonc2.default();
      jsonc.deserialize(testData);
      wasCalledWithData.should.be.true;

      _deserializer2.default.prototype.deserialize = oldDeserialize;
    });
  });

  describe(".register()", function () {

    it('registers the supplied "class" using the __type__ property', function () {
      var _class, _temp;

      var TestClass = (_temp = _class = function TestClass() {
        _classCallCheck(this, TestClass);
      }, _class.__type__ = 'test', _temp);


      var jsonc = new _jsonc2.default();
      jsonc.register(TestClass);
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it('registers the supplied "class" using the supplied type name', function () {
      var TestClass = function TestClass() {
        _classCallCheck(this, TestClass);
      };

      var jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test');
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it('should set the class\'s __type__ property to the supplied type name', function () {
      var TestClass = function TestClass() {
        _classCallCheck(this, TestClass);
      };

      var jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test');
      TestClass.__type__.should.equal('test');
    });

    it('should register the options with the type', function () {
      var TestClass = function TestClass() {
        _classCallCheck(this, TestClass);
      };

      var options = {};

      var jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test', options);
      jsonc.registry['test'].options.should.equal(options);
    });
  });
});

//# sourceMappingURL=jsonc.tests.js.map