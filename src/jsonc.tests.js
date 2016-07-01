'use strict';

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

_chai2.default.should();
const expect = _chai2.default.expect;
_chai2.default.use(_chaiThings2.default);

describe("Jsonc", () => {
  describe('.hasType()', () => {

    it('returns false if the class type has not been registered', () => {
      const jsonc = new _jsonc2.default();
      jsonc.hasType({ __type__: 'test' }).should.be.false;
    });

    it('returns true if the class type has been registered', () => {
      const jsonc = new _jsonc2.default();
      jsonc.registry.test = 1;
      jsonc.hasType({ __type__: 'test' }).should.be.true;
    });
  });

  describe('.hasTypeName()', () => {

    it('returns false if the class type has not been registered', () => {
      const jsonc = new _jsonc2.default();
      jsonc.hasTypeName('test').should.be.false;
    });

    it('returns true if the class type has been registered', () => {
      const jsonc = new _jsonc2.default();
      jsonc.registry.test = 1;
      jsonc.hasTypeName('test').should.be.true;
    });
  });

  describe('.stringify()', () => {

    it('returns a serialized, stringified version of the supplied data', () => {
      const jsonc = new _jsonc2.default();
      jsonc.serialize = data => data;
      const data = { test: 123 };
      jsonc.stringify(data).should.equal(_json2.default.stringify(data));
    });
  });

  describe('.parse()', () => {

    it('returns a deserialized version of the supplied JSON5', () => {
      const jsonc = new _jsonc2.default();
      jsonc.deserialize = data => data;
      const data = { test: 123 };
      jsonc.parse(_json2.default.stringify(data)).should.eql(data);
    });
  });

  describe('.serialize()', () => {

    it('passes the call on to the Serializer class', () => {
      const oldSerialize = _serializer2.default.prototype.serialize;

      const testData = {};
      let wasCalledWithData = false;
      _serializer2.default.prototype.serialize = data => wasCalledWithData = testData === data;
      const jsonc = new _jsonc2.default();
      jsonc.serialize(testData);
      wasCalledWithData.should.be.true;

      _serializer2.default.prototype.serialize = oldSerialize;
    });
  });

  describe(".deserialize()", () => {

    it('passes the call on to the Deserializer class', () => {
      const oldDeserialize = _deserializer2.default.prototype.deserialize;

      const testData = {};
      let wasCalledWithData = false;
      _deserializer2.default.prototype.deserialize = data => wasCalledWithData = testData === data;
      const jsonc = new _jsonc2.default();
      jsonc.deserialize(testData);
      wasCalledWithData.should.be.true;

      _deserializer2.default.prototype.deserialize = oldDeserialize;
    });
  });

  describe(".register()", () => {

    it('registers the supplied "class" using the __type__ property', () => {
      var _class, _temp;

      let TestClass = (_temp = _class = class TestClass {}, _class.__type__ = 'test', _temp);


      const jsonc = new _jsonc2.default();
      jsonc.register(TestClass);
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it('registers the supplied "class" using the supplied type name', () => {
      let TestClass = class TestClass {};


      const jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test');
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it(`should set the class's __type__ property to the supplied type name`, () => {
      let TestClass = class TestClass {};


      const jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test');
      TestClass.__type__.should.equal('test');
    });

    it('should register the options with the type', () => {
      let TestClass = class TestClass {};

      const options = {};

      const jsonc = new _jsonc2.default();
      jsonc.register(TestClass, 'test', options);
      jsonc.registry['test'].options.should.equal(options);
    });

    describe('.getOptions()', () => {
      it('should return the registered options', () => {
        let TestClass = class TestClass {};

        const options = { test: 'test' };

        const jsonc = new _jsonc2.default();
        jsonc.register(TestClass, 'test', options);
        jsonc.getOptions('test').test.should.equal(options.test);
      });

      it('should return the registered options merged with those of the parent', () => {
        let ParentClass = class ParentClass {};
        let ChildClass = class ChildClass extends ParentClass {};

        const parentOptions = { exclude: ['test'] };
        const childOptions = { include: ['test2'] };

        const jsonc = new _jsonc2.default();
        jsonc.register(ParentClass, 'parent', parentOptions);
        jsonc.register(ChildClass, 'child', childOptions);
        const options = jsonc.getOptions('child');
        options.exclude.should.equal(parentOptions.exclude);
        options.include.should.eql(childOptions.include);
      });
    });
  });

  describe('.registerFn()', () => {
    it('registers the supplied fn of the registered class', () => {
      var _class2, _temp2;

      let TestClass = (_temp2 = _class2 = class TestClass {

        testFunction() {}
      }, _class2.__type__ = 'test', _temp2);


      const jsonc = new _jsonc2.default();
      jsonc.register(TestClass);
      jsonc.registerFunction(TestClass.prototype.testFunction, TestClass, 'test');
      expect(jsonc.fnRegistry.get(TestClass.prototype.testFunction)).to.equal('test.test');
      expect(jsonc.fnReverseRegistry.get('test.test')).to.equal(TestClass.prototype.testFunction);
    });
  });
});

//# sourceMappingURL=jsonc.tests.js.map