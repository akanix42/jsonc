import 'babel-polyfill';
import chai from 'chai';
import chaiThings from 'chai-things';
import Deserializer from './deserializer';

chai.should();
chai.use(chaiThings);

describe('Deserializer', () => {
  describe('.deserialize()', () => {

    it('deserializes empty objects', () => {
      const deserializer = new Deserializer();
      const input = {instances: [], root: {}};
      const output = deserializer.deserialize(input);

      output.should.eql({});
    });

    it('deserializes string properties', () => {
      const deserializer = new Deserializer();
      const input = {instances: [], root: {a: 'test'}};
      const output = deserializer.deserialize(input);

      output.should.eql({a: 'test'});
    });

    it('deserializes boolean properties', () => {
      const deserializer = new Deserializer();
      const input = {instances: [], root: {a: true}};
      const output = deserializer.deserialize(input);

      output.should.eql({a: true});
    });

    it('deserializes number properties', () => {
      const deserializer = new Deserializer();
      const input = {instances: [], root: {a: 1}};
      const output = deserializer.deserialize(input);

      output.should.eql({a: 1});
    });

    it('deserializes an array', () => {
      const deserializer = new Deserializer();
      const input = {instances: [], root: [1, 2]};
      const output = deserializer.deserialize(input);

      output.should.eql([1, 2]);
    });

    it('deserializes a Map', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances:[{__type__:"__native_map__",__value__:[{__index__:1}]},{__type__:"__array__",__value__:[1,2]}],root:[{__index__:0}]};
      const output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(Map);
      [...output[0]].should.eql([[1, 2]]);
    });

    it('deserializes a Set', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances:[{__type__:"__native_set__",__value__:[1,2]}],root:[{__index__:0}]};
      const output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(Set);
      [...output[0]].should.eql([1, 2]);
    });

    it('deserializes nested objects', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__object__", __value__: {c: "test"}}], root: {a: 1, b: {__index__: 0}}};
      const output = deserializer.deserialize(input);

      output.should.eql({a: 1, b: {c: 'test'}});
    });

    it('deserializes object references to the same object instance', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {
        instances: [{__type__: "__object__", __value__: {}}],
        root: [{__index__: 0}, {__index__: 0}, {__index__: 0}]
      };
      const output = deserializer.deserialize(input);

      const obj = output[0];
      output.should.all.equal(obj);
    });

    it('deserializes registered types', () => {
      class TestClass {
        static __type__ = 'test';
        test = '123';
      }

      const mockJsonc = {hasTypeName: () => true, registry: {test: {type: TestClass}}};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "test", __value__: {test: "123"}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output[0].should.be.an.instanceOf(TestClass);
    });

    it('allows post-processing of registered types via the Deserializer.Symbols.PostProcess property', () => {
      class TestClass {
        static __type__ = 'test';
        test = '123';

        [Deserializer.Symbols.PostProcess]() {
          this.test = 'cats!';
        }
      }

      const mockJsonc = {hasTypeName: () => true, registry: {test: {type: TestClass}}};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "test", __value__: {test: "123"}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output[0].test.should.equal('cats!');
    });

  });
});
