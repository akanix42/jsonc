import chai from 'chai';
import annotations from './annotations';

chai.should();
const expect = chai.expect;

describe('Annotations', () => {
  describe('serializable', () => {
    let mockJsonc;
    beforeEach(()=> {
      mockJsonc = {
        register() {
        }
      };
    });

    it('should register the supplied class', () => {
      const testTypeName = 'Test';
      let wasCalledWithClassAndTypeName = false;
      const mockJsonc = {register: (constructor, typeName) => wasCalledWithClassAndTypeName = constructor.name === 'TestClass' && typeName === testTypeName};
      const {serializable} = annotations(mockJsonc);

      @serializable(testTypeName)
      class TestClass {
      }

      wasCalledWithClassAndTypeName.should.be.true;
    });

    it('should register the supplied class with options', () => {
      const testTypeName = 'Test';
      const testOptions = {};
      let wasCalledWithAllArguments = false;
      const mockJsonc = {register: (constructor, typeName, options) => wasCalledWithAllArguments = constructor.name === 'TestClass' && typeName === testTypeName && options === testOptions};
      const {serializable} = annotations(mockJsonc);

      @serializable(testTypeName, testOptions)
      class TestClass {
      }

      wasCalledWithAllArguments.should.be.true;
    });

    it('should throw an error if no class name is supplied', () => {
      const {serializable} = annotations();

      serializable.should.throw(/type name must be supplied/);
    });

    it('should throw an error if no class name is supplied', () => {
      const {serializable} = annotations();

      try {
        @serializable
        class TestClass {
        }
      } catch (ex) {
        ex.message.should.match(/type name must be supplied/);
      }
    });
  });
});
