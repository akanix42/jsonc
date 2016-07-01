import chai from 'chai';
import chaiThings from 'chai-things';
import Deserializer from './deserializer';

chai.should();
const expect = chai.expect;
chai.use(chaiThings);

describe('Deserializer', () => {
  describe('.deserialize()', () => {

    it('deserializes empty objects', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__object__", __value__: {}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.eql({});
    });

    it('deserializes string properties', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__object__", __value__: {a: "test"}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.eql({a: 'test'});
    });

    it('deserializes boolean properties', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__object__", __value__: {a: true}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.eql({a: true});
    });

    it('deserializes number properties', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__object__", __value__: {a: 1}}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.eql({a: 1});
    });

    it('deserializes an Array', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__array__", __value__: [1, 2]}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.eql([1, 2]);
    });

    it('deserializes an Array with extra properties', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {
        instances: [{__type__: "__array__", __value__: {__array__: [1, 2], __props__: {test: "123"}}}],
        root: [{__index__: 0}]
      };
      const output = deserializer.deserialize(input);

      const array = [1, 2];
      array.test = '123';
      output.should.eql(array);
    });

    it('deserializes a Map', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {
        instances: [{__type__: "__native_map__", __value__: [{__index__: 1}]}, {
          __type__: "__array__",
          __value__: [1, 2]
        }], root: [{__index__: 0}]
      };
      const output = deserializer.deserialize(input);

      output.should.be.an.instanceOf(Map);
      [...output].should.eql([[1, 2]]);
    });

    it('deserializes a Set', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances: [{__type__: "__native_set__", __value__: [1, 2]}], root: [{__index__: 0}]};
      const output = deserializer.deserialize(input);

      output.should.be.an.instanceOf(Set);
      [...output].should.eql([1, 2]);
    });

    it('deserializes nested objects', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {
        instances: [{
          __type__: "__object__",
          __value__: {a: 1, b: {__index__: 1}}
        }, {__type__: "__object__", __value__: {c: "test"}}], root: [{__index__: 0}]
      };
      const output = deserializer.deserialize(input);

      output.should.eql({a: 1, b: {c: 'test'}});
    });

    it('deserializes object references to the same object instance', () => {
      const mockJsonc = {hasTypeName: () => false};
      const deserializer = new Deserializer(mockJsonc);
      const input = {
        instances: [{
          __type__: "__array__",
          __value__: [{__index__: 1}, {__index__: 1}, {__index__: 1}]
        }, {__type__: "__object__", __value__: {}}], root: [{__index__: 0}]
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

      output.should.be.an.instanceOf(TestClass);
      expect(output.test).to.equal('123');
    });

    it('deserializes registered types that extend Array', () => {
      class TestClass extends Array {
        static __type__ = 'test';
        test = '123';
      }
      const obj = new TestClass();
      obj.push(1);
      obj.push(2);

      const mockJsonc = {hasTypeName: () => true, registry: {test: {type: TestClass}}};
      const deserializer = new Deserializer(mockJsonc);
      const input = {instances:[{__type__:"test",__value__:{__array__:[1,2],__props__:{test:"123"}}}],root:[{__index__:0}]};
      const output = deserializer.deserialize(input);

      expect(output).to.be.an.instanceOf(TestClass);
      expect(output.test).to.equal('123');
      expect(output[0]).to.equal(1);
      expect(output[1]).to.equal(2);
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

      output.test.should.equal('cats!');
    });

  });
});
