'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiThings = require('chai-things');

var _chaiThings2 = _interopRequireDefault(_chaiThings);

var _deserializer = require('./deserializer');

var _deserializer2 = _interopRequireDefault(_deserializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();
_chai2.default.use(_chaiThings2.default);

describe('Deserializer', () => {
  describe('.deserialize()', () => {

    it('deserializes empty objects', () => {
      const deserializer = new _deserializer2.default();
      const input = { instances: [], root: {} };
      const output = deserializer.deserialize(input);

      output.should.eql({});
    });

    it('deserializes string properties', () => {
      const deserializer = new _deserializer2.default();
      const input = { instances: [], root: { a: 'test' } };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 'test' });
    });

    it('deserializes boolean properties', () => {
      const deserializer = new _deserializer2.default();
      const input = { instances: [], root: { a: true } };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: true });
    });

    it('deserializes number properties', () => {
      const deserializer = new _deserializer2.default();
      const input = { instances: [], root: { a: 1 } };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 1 });
    });

    it('deserializes an array', () => {
      const deserializer = new _deserializer2.default();
      const input = { instances: [], root: [1, 2] };
      const output = deserializer.deserialize(input);

      output.should.eql([1, 2]);
    });

    it('deserializes a Map', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__native_map__", __value__: [{ __index__: 1 }] }, { __type__: "__array__", __value__: [1, 2] }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(Map);
      [...output[0]].should.eql([[1, 2]]);
    });

    it('deserializes a Set', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__native_set__", __value__: [1, 2] }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(Set);
      [...output[0]].should.eql([1, 2]);
    });

    it('deserializes nested objects', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "__object__", __value__: { c: "test" } }], root: { a: 1, b: { __index__: 0 } } };
      const output = deserializer.deserialize(input);

      output.should.eql({ a: 1, b: { c: 'test' } });
    });

    it('deserializes object references to the same object instance', () => {
      const mockJsonc = { hasTypeName: () => false };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = {
        instances: [{ __type__: "__object__", __value__: {} }],
        root: [{ __index__: 0 }, { __index__: 0 }, { __index__: 0 }]
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

      output[0].should.be.an.instanceOf(TestClass);
    });

    it('allows post-processing of registered types via the Deserializer.Symbols.PostProcess property', () => {
      var _class2, _temp2;

      let TestClass = (_temp2 = _class2 = class TestClass {
        constructor() {
          this.test = '123';
        }

        [_deserializer2.default.Symbols.PostProcess]() {
          this.test = 'cats!';
        }
      }, _class2.__type__ = 'test', _temp2);


      const mockJsonc = { hasTypeName: () => true, registry: { test: { type: TestClass } } };
      const deserializer = new _deserializer2.default(mockJsonc);
      const input = { instances: [{ __type__: "test", __value__: { test: "123" } }], root: [{ __index__: 0 }] };
      const output = deserializer.deserialize(input);

      output[0].test.should.equal('cats!');
    });
  });
});

//# sourceMappingURL=deserializer.tests.js.map