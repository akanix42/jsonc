import 'babel-polyfill';
import chai from 'chai';
import json5 from 'json5';
import Serializer from './serializer';

chai.should();

describe('Serializer', () => {
  describe('.serialize()', () => {

    it('serializes empty objects', () => {
      const serializer = new Serializer();
      const output = json5.stringify(serializer.serialize({}));

      output.should.equal('{instances:[],root:{}}');
    });

    it('serializes string properties', () => {
      const serializer = new Serializer();
      const output = json5.stringify(serializer.serialize({a: 'test'}));

      output.should.equal('{instances:[],root:{a:"test"}}');
    });

    it('serializes boolean properties', () => {
      const serializer = new Serializer();
      const output = json5.stringify(serializer.serialize({a: true}));

      output.should.equal('{instances:[],root:{a:true}}');
    });

    it('serializes number properties', () => {
      const serializer = new Serializer();
      const output = json5.stringify(serializer.serialize({a: 1}));

      output.should.equal('{instances:[],root:{a:1}}');
    });

    it('serializes an array', () => {
      const serializer = new Serializer();
      const output = json5.stringify(serializer.serialize([1, 2]));

      output.should.equal('{instances:[],root:[1,2]}');
    });

    it('serializes a Map', () => {
      const mockJsonc = {hasType: () => false};
      const serializer = new Serializer(mockJsonc);
      const output = json5.stringify(serializer.serialize([new Map([[1,2]])]));

      output.should.equal('{instances:[{__type__:"__native_map__",__value__:[{__index__:1}]},{__type__:"__array__",__value__:[1,2]}],root:[{__index__:0}]}');
    });

    it('serializes a Set', () => {
      const mockJsonc = {hasType: () => false};
      const serializer = new Serializer(mockJsonc);
      const output = json5.stringify(serializer.serialize([new Set([1, 2])]));

      output.should.equal('{instances:[{__type__:"__native_set__",__value__:[1,2]}],root:[{__index__:0}]}');
    });

    it('serializes nested objects', () => {
      const mockJsonc = {hasType: () => false};
      const serializer = new Serializer(mockJsonc);
      const obj = {a: 1, b: {c: 'test'}};
      const output = json5.stringify(serializer.serialize(obj));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{c:"test"}}],root:{a:1,b:{__index__:0}}}');
    });

    it('serializes registered types', () => {
      const mockJsonc = {hasType: () => true, registry: {'test': {}}, getOptions: ()=>null};
      const serializer = new Serializer(mockJsonc);
      class TestClass {
        static __type__ = 'test';
        test = '123';
      }
      const obj = new TestClass();
      const output = json5.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('stores references to an object instead of multiple copies', () => {
      const mockJsonc = {hasType: () => false};
      const serializer = new Serializer(mockJsonc);
      const obj = {};
      const output = json5.stringify(serializer.serialize([obj, obj, obj]));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{}}],root:[{__index__:0},{__index__:0},{__index__:0}]}');
    });

    it('allows serialization overriding of registered types via the Serializer.Symbols.Serialize property', () => {
      const mockJsonc = {hasType: () => true, registry: {'test': {}}, getOptions: ()=>null};
      const serializer = new Serializer(mockJsonc);
      class TestClass {
        static __type__ = 'test';

        [Serializer.Symbols.Serialize]() {
          return {test: '123'};
        }
      }
      const obj = new TestClass();
      const output = json5.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test:"123"}}],root:[{__index__:0}]}');
    });

    it('allows serialization overriding of plain objects via the Serializer.Symbols.Serialize property', () => {
      const mockJsonc = {hasType: () => false};
      const serializer = new Serializer(mockJsonc);
      const obj = {
        [Serializer.Symbols.Serialize]() {
          return {test: '123'};
        }
      };
      const output = json5.stringify(serializer.serialize({obj}));

      output.should.equal('{instances:[{__type__:"__object__",__value__:{test:"123"}}],root:{obj:{__index__:0}}}');
    });

    it('allows excluding specified properties from serialization', () => {
      const serializationOptions = {exclude: ['test']};
      const mockJsonc = {hasType: () => true, getOptions: ()=>serializationOptions};
      const serializer = new Serializer(mockJsonc);
      class TestClass {
        static __type__ = 'test';
        test = '123';
      }
      const obj = new TestClass();
      const output = json5.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{}}],root:[{__index__:0}]}');
    });

    it('allows including only specified properties in serialization', () => {
      const serializationOptions = {include: ['test2']};
      const mockJsonc = {hasType: () => true, getOptions: ()=>serializationOptions};
      const serializer = new Serializer(mockJsonc);
      class TestClass {
        static __type__ = 'test';
        test = '123';
        test2 = '123';
      }
      const obj = new TestClass();
      const output = json5.stringify(serializer.serialize([obj]));

      output.should.equal('{instances:[{__type__:"test",__value__:{test2:"123"}}],root:[{__index__:0}]}');
    });

  });
});
