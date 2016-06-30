'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _serializer = require('./serializer');

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Serializer', () => {
  describe('.serialize()', () => {

    it('serializes empty objects', () => {
      const serializer = new _serializer2.default();
      const output = _json2.default.stringify(serializer.serialize({}));

      output.should.equal('{instances:[],root:{}}');
    });

    it('serializes string properties', () => {
      const serializer = new _serializer2.default();
      const output = _json2.default.stringify(serializer.serialize({ a: 'test' }));

      output.should.equal('{instances:[],root:{a:"test"}}');
    });

    it('serializes boolean properties', () => {
      const serializer = new _serializer2.default();
      const output = _json2.default.stringify(serializer.serialize({ a: true }));

      output.should.equal('{instances:[],root:{a:true}}');
    });

    it('serializes number properties', () => {
      const serializer = new _serializer2.default();
      const output = _json2.default.stringify(serializer.serialize({ a: 1 }));

      output.should.equal('{instances:[],root:{a:1}}');
    });

    it('serializes an array', () => {
      const serializer = new _serializer2.default();
      const output = _json2.default.stringify(serializer.serialize([1, 2]));

      output.should.equal('{instances:[],root:[1,2]}');
    });

    it('serializes a Map', () => {
      const mockJsonc = { hasType: () => false };
      const serializer = new _serializer2.default(mockJsonc);
      const output = _json2.default.stringify(serializer.serialize([new Map([[1, 2]])]));

      output.should.equal('{instances:[{__type__:"__native_map__",__value__:[{__index__:1}]},{__type__:"__array__",__value__:[1,2]}],root:[{__index__:0}]}');
    });

    it('serializes a Set', () => {
      const mockJsonc = { hasType: () => false };
      const serializer = new _serializer2.default(mockJsonc);
      const output = _json2.default.stringify(serializer.serialize([new Set([1, 2])]));

      output.should.equal('{instances:[{__type__:"__native_set__",__value__:[1,2]}],root:[{__index__:0}]}');
    });

    it('serializes nested objects', () => {
      const mockJsonc = { hasType: () => false };
      const serializer = new _serializer2.default(mockJsonc);
      const obj = { a: 1, b: { c: 'test' } };
      const output = _json2.default.stringify(serializer.serialize(obj));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{c:"test"}}],root:{a:1,b:{__index__:0}}}');
    });

    it('serializes registered types', () => {
      var _class, _temp;

      const mockJsonc = { hasType: () => true, registry: { 'test': {} }, getOptions: () => null };
      const serializer = new _serializer2.default(mockJsonc);
      let TestClass = (_temp = _class = class TestClass {
        constructor() {
          this.test = '123';
        }

      }, _class.__type__ = 'test', _temp);

      const obj = new TestClass();
      const output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('stores references to an object instead of multiple copies', () => {
      const mockJsonc = { hasType: () => false };
      const serializer = new _serializer2.default(mockJsonc);
      const obj = {};
      const output = _json2.default.stringify(serializer.serialize([obj, obj, obj]));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{}}],root:[{__index__:0},{__index__:0},{__index__:0}]}');
    });

    it('allows serialization overriding of registered types via the Serializer.Symbols.Serialize property', () => {
      var _class2, _temp2;

      const mockJsonc = { hasType: () => true, registry: { 'test': {} }, getOptions: () => null };
      const serializer = new _serializer2.default(mockJsonc);
      let TestClass = (_temp2 = _class2 = class TestClass {

        [_serializer2.default.Symbols.Serialize]() {
          return { test: '123' };
        }
      }, _class2.__type__ = 'test', _temp2);

      const obj = new TestClass();
      const output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('allows serialization overriding of plain objects via the Serializer.Symbols.Serialize property', () => {
      const mockJsonc = { hasType: () => false };
      const serializer = new _serializer2.default(mockJsonc);
      const obj = {
        [_serializer2.default.Symbols.Serialize]() {
          return { test: '123' };
        }
      };
      const output = _json2.default.stringify(serializer.serialize({ obj }));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{test:"123"}}],root:{obj:{__index__:0}}}');
    });

    it('allows excluding specified properties from serialization', () => {
      var _class3, _temp3;

      const serializationOptions = { exclude: ['test'] };
      const mockJsonc = { hasType: () => true, getOptions: () => serializationOptions };
      const serializer = new _serializer2.default(mockJsonc);
      let TestClass = (_temp3 = _class3 = class TestClass {
        constructor() {
          this.test = '123';
        }

      }, _class3.__type__ = 'test', _temp3);

      const obj = new TestClass();
      const output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{}}],root:[{__index__:0}]}');
    });

    it('allows including only specified properties in serialization', () => {
      var _class4, _temp4;

      const serializationOptions = { include: ['test2'] };
      const mockJsonc = { hasType: () => true, getOptions: () => serializationOptions };
      const serializer = new _serializer2.default(mockJsonc);
      let TestClass = (_temp4 = _class4 = class TestClass {
        constructor() {
          this.test = '123';
          this.test2 = '123';
        }

      }, _class4.__type__ = 'test', _temp4);

      const obj = new TestClass();
      const output = _json2.default.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test2:"123"}}],root:[{__index__:0}]}');
    });
  });
});

//# sourceMappingURL=serializer.tests.js.map