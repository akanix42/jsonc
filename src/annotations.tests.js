'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _annotations = require('./annotations');

var _annotations2 = _interopRequireDefault(_annotations);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Annotations', () => {
  describe('serializable', () => {
    let mockJsonc;
    beforeEach(() => {
      mockJsonc = {
        register() {}
      };
    });

    it('should register the supplied class', () => {
      var _dec, _class;

      const testTypeName = 'Test';
      let wasCalledWithClassAndTypeName = false;
      const mockJsonc = { register: (constructor, typeName) => wasCalledWithClassAndTypeName = constructor.name === 'TestClass' && typeName === testTypeName };
      const { serializable } = (0, _annotations2.default)(mockJsonc);

      let TestClass = (_dec = serializable(testTypeName), _dec(_class = class TestClass {}) || _class);


      wasCalledWithClassAndTypeName.should.be.true;
    });

    it('should register the supplied class with options', () => {
      var _dec2, _class2;

      const testTypeName = 'Test';
      const testOptions = {};
      let wasCalledWithAllArguments = false;
      const mockJsonc = { register: (constructor, typeName, options) => wasCalledWithAllArguments = constructor.name === 'TestClass' && typeName === testTypeName && options === testOptions };
      const { serializable } = (0, _annotations2.default)(mockJsonc);

      let TestClass = (_dec2 = serializable(testTypeName, testOptions), _dec2(_class2 = class TestClass {}) || _class2);


      wasCalledWithAllArguments.should.be.true;
    });

    it('should throw an error if no class name is supplied', () => {
      const { serializable } = (0, _annotations2.default)();

      serializable.should.throw(/type name must be supplied/);
    });

    it('should throw an error if no class name is supplied', () => {
      const { serializable } = (0, _annotations2.default)();

      try {
        var _class3;

        let TestClass = serializable(_class3 = class TestClass {}) || _class3;
      } catch (ex) {
        ex.message.should.match(/type name must be supplied/);
      }
    });
  });
});

//# sourceMappingURL=annotations.tests.js.map