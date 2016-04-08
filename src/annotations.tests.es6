import 'babel-polyfill';
import chai from 'chai';
import annotations from './annotations';
import autobind from 'autobind-decorator'

chai.should();


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
      const mockJsonc = { register: (constructor, typeName) => wasCalledWithClassAndTypeName = constructor.name ==='TestClass' && typeName === testTypeName};
      const { serializable } = annotations(mockJsonc);

      @serializable(testTypeName)
      class TestClass {
      }

      wasCalledWithClassAndTypeName.should.be.true;
    });

    it('should throw an error if no class name is supplied', () => {
      const { serializable } = annotations();

      serializable.should.throw(/type name must be supplied/);
    });

    it('should throw an error if no class name is supplied', () => {
      const { serializable } = annotations();

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