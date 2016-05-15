'use strict';

import "babel-polyfill";
import chai from 'chai';
import chaiThings from 'chai-things';
import json5 from 'json5';
import Jsonc from './jsonc';
import Serializer from './serializer';
import Deserializer from './deserializer';

chai.should();
chai.use(chaiThings);

describe("Jsonc", () => {
  describe('.hasType()', () => {

    it('returns false if the class type has not been registered', ()=> {
      const jsonc = new Jsonc();
      jsonc.hasType({__type__: 'test'}).should.be.false;
    });

    it('returns true if the class type has been registered', ()=> {
      const jsonc = new Jsonc();
      jsonc.registry.test = 1;
      jsonc.hasType({__type__: 'test'}).should.be.true;
    });

  });

  describe('.hasTypeName()', () => {

    it('returns false if the class type has not been registered', ()=> {
      const jsonc = new Jsonc();
      jsonc.hasTypeName('test').should.be.false;
    });

    it('returns true if the class type has been registered', ()=> {
      const jsonc = new Jsonc();
      jsonc.registry.test = 1;
      jsonc.hasTypeName('test').should.be.true;
    });

  });

  describe('.stringify()', () => {

    it('returns a serialized, stringified version of the supplied data', ()=> {
      const jsonc = new Jsonc();
      jsonc.serialize = (data) => data;
      const data = {test: 123};
      jsonc.stringify(data).should.equal(json5.stringify(data));
    });

  });

  describe('.parse()', () => {

    it('returns a deserialized version of the supplied JSON5', ()=> {
      const jsonc = new Jsonc();
      jsonc.deserialize = (data) => data;
      const data = {test: 123};
      jsonc.parse(json5.stringify(data)).should.eql(data);
    });

  });

  describe('.serialize()', () => {

    it('passes the call on to the Serializer class', () => {
      const oldSerialize = Serializer.prototype.serialize;

      const testData = {};
      let wasCalledWithData = false;
      Serializer.prototype.serialize = (data) => wasCalledWithData = testData === data;
      const jsonc = new Jsonc();
      jsonc.serialize(testData);
      wasCalledWithData.should.be.true;

      Serializer.prototype.serialize = oldSerialize;
    });

  });

  describe(".deserialize()", () => {

    it('passes the call on to the Deserializer class', () => {
      const oldDeserialize = Deserializer.prototype.deserialize;

      const testData = {};
      let wasCalledWithData = false;
      Deserializer.prototype.deserialize = (data) => wasCalledWithData = testData === data;
      const jsonc = new Jsonc();
      jsonc.deserialize(testData);
      wasCalledWithData.should.be.true;

      Deserializer.prototype.deserialize = oldDeserialize;
    });
  });

  describe(".register()", () => {

    it('registers the supplied "class" using the __type__ property', () => {
      class TestClass {
        static __type__ = 'test';
      }

      const jsonc = new Jsonc();
      jsonc.register(TestClass);
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it('registers the supplied "class" using the supplied type name', () => {
      class TestClass {
      }

      const jsonc = new Jsonc();
      jsonc.register(TestClass, 'test');
      jsonc.registry['test'].type.should.equal(TestClass);
    });

    it(`should set the class's __type__ property to the supplied type name`, () => {
      class TestClass {
      }

      const jsonc = new Jsonc();
      jsonc.register(TestClass, 'test');
      TestClass.__type__.should.equal('test');
    });

    it('should register the options with the type', () => {
      class TestClass {
      }
      const options = {};

      const jsonc = new Jsonc();
      jsonc.register(TestClass, 'test', options);
      jsonc.registry['test'].options.should.equal(options);
    });

    describe('.getOptions()', () => {
      it('should return the registered options', () => {
        class TestClass {
        }
        const options = { test: 'test'};

        const jsonc = new Jsonc();
        jsonc.register(TestClass, 'test', options);
        jsonc.getOptions('test').test.should.equal(options.test);
      });

      it('should return the registered options merged with those of the parent', () => {
        class ParentClass {
        }
        class ChildClass extends ParentClass {
        }
        const parentOptions = {exclude: ['test']};
        const childOptions = {include: ['test2']};

        const jsonc = new Jsonc();
        jsonc.register(ParentClass, 'parent', parentOptions);
        jsonc.register(ChildClass, 'child', childOptions);
        const options = jsonc.getOptions('child');
        options.exclude.should.equal(parentOptions.exclude);
        options.include.should.eql(childOptions.include);
      });
    });

  });
});
