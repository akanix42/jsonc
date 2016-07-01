'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireDefault(_chaiThings);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
const expect = _chai2.default.expect;
_chai2.default.use(_chaiThings2.default);

describe('Deserializer', () => {
  describe('.deserialize()', () => {

    it('deserializes empty objects', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: {} }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.eql({});
    });

    it('deserializes string properties', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: { a: "test" } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 'test' });
    });

    it('deserializes boolean properties', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: { a: true } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: true });
    });

    it('deserializes number properties', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: { a: 1 } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 1 });
    });

    it('deserializes an Array', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__array__", __value__: [1, 2] }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.eql([1, 2]);
    });

    it('deserializes an Array with extra properties', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{ __type__: "__array__", __value__: { __array__: [1, 2], __props__: { test: "123" } } }],
        root: [{ __index__: 0 }]
      };
      const output = deserializer.deserialize(input);

      const array = [1, 2];
      array.test = '123';
      output.should.eql(array);
    });

    it('deserializes a Map', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{ __type__: "__native_map__", __value__: [{ __index__: 1 }] }, {
          __type__: "__array__",
          __value__: [1, 2]
        }], root: [{ __index__: 0 }]
      };
      const output = deserializer.deserialize(input);

      output.should.be.an.instanceOf(Map);
      [...output].should.eql([[1, 2]]);
    });

    it('deserializes a Set', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__native_set__", __value__: [1, 2] }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.be.an.instanceOf(Set);
      [...output].should.eql([1, 2]);
    });

    it('deserializes nested objects', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{
          __type__: "__object__",
          __value__: { a: 1, b: { __index__: 1 } }
        }, { __type__: "__object__", __value__: { c: "test" } }], root: [{ __index__: 0 }]
      };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 1, b: { c: 'test' } });
    });

    it('deserializes object references to the same object instance', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{
          __type__: "__array__",
          __value__: [{ __index__: 1 }, { __index__: 1 }, { __index__: 1 }]
        }, { __type__: "__object__", __value__: {} }], root: [{ __index__: 0 }]
      };
      const output = deserializer.deserialize(input);

      const obj = output[0];
      output.should.all.equal(obj);
    });

    it('deserializes registered types', () => {
      var _class, _temp;

      let TestClass = (_temp = _class = class TestClass {
        constructor() {
          this.test = '123';
        }

      }, _class.__type__ = 'test', _temp);


      const mockJsonc = { hasTypeName: () => true, registry: { test: { type: TestClass } } };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.should.be.an.instanceOf(TestClass);
      expect(output.test).to.equal('123');
    });

    it('deserializes registered types that extend Array', () => {
      var _class2, _temp3;

      let TestClass = (_temp3 = _class2 = class TestClass extends Array {
        constructor(...args) {
          var _temp2;

          return _temp2 = super(...args), this.test = '123', _temp2;
        }

      }, _class2.__type__ = 'test', _temp3);

      const obj = new TestClass();
      obj.push(1);
      obj.push(2);

      const mockJsonc = { hasTypeName: () => true, registry: { test: { type: TestClass } } };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{ __type__: "test", __value__: { __array__: [1, 2], __props__: { test: "123" } } }],
        root: [{ __index__: 0 }]
      };
      const output = deserializer.deserialize(input);

      expect(output).to.be.an.instanceOf(TestClass);
      expect(output.test).to.equal('123');
      expect(output[0]).to.equal(1);
      expect(output[1]).to.equal(2);
    });

    it('deserializes registered functions', () => {
      function testFunction() {
        return 'hello world';
      }

      const mockJsonc = { fnReverseRegistry: new Map([['test', testFunction]]) };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [], root: [{ __fn__: "test" }] };
      const output = deserializer.deserialize(input);
      expect(output).to.equal(testFunction);
    });

    it('deserializes registered functions of registered types', () => {
      var _class3, _temp4;

      let TestClass = (_temp4 = _class3 = class TestClass {
        constructor() {
          this.test = '123';
        }

        testFunction() {}
      }, _class3.__type__ = 'test', _temp4);


      const mockJsonc = {
        hasTypeName: typeName => typeName === 'test',
        registry: { test: { type: TestClass } },
        fnReverseRegistry: new Map([['test.test', TestClass.prototype.testFunction]])
      };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: { obj: { __index__: 1 }, test: { __fn__: "test.test" } } }, { __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      expect(output.test).to.equal(TestClass.prototype.testFunction);
      expect(output.obj).to.be.an.instanceOf(TestClass);
      expect(output.obj.test).to.equal('123');
    });

    it('allows post-processing of registered types via the Deserializer.Symbols.PostProcess property', () => {
      var _class4, _temp5;

      let TestClass = (_temp5 = _class4 = class TestClass {
        constructor() {
          this.test = '123';
        }

        [_deserializer2.default.Symbols.PostProcess]() {
          this.test = 'cats!';
        }
      }, _class4.__type__ = 'test', _temp5);


      const mockJsonc = { hasTypeName: () => true, registry: { test: { type: TestClass } } };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output.test.should.equal('cats!');
    });
  });
});

//# sourceMappingURL=deserializer.tests.js.map