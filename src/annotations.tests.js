'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _annotations = require('./annotations');

var _annotations2 = _interopRequireDefault(_annotations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

_chai2.default.should();
const expect = _chai2.default.expect;

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
  describe('include', () => {
    it('should register the function', done => {
      var _desc, _value, _class4;

      const mockJsonc = {
        registerFunction: (fn, type, key) => {
          expect(fn).to.be.a('function');
          expect(fn.name).to.equal('testFunction');
          expect(type.constructor.name).to.equal('TestClass');
          expect(key).to.equal('testFunction');
          done();
        }
      };
      const { include } = (0, _annotations2.default)(mockJsonc);

      let TestClass = (_class4 = class TestClass {
        testFunction() {}
      }, (_applyDecoratedDescriptor(_class4.prototype, 'testFunction', [include], Object.getOwnPropertyDescriptor(_class4.prototype, 'testFunction'), _class4.prototype)), _class4);
    });
  });
});

//# sourceMappingURL=annotations.tests.js.map