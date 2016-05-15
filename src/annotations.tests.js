'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _annotations5 = require('./annotations');

var _annotations6 = _interopRequireDefault(_annotations5);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.should();

describe('Annotations', function () {
  describe('serializable', function () {
    var mockJsonc = void 0;
    beforeEach(function () {
      mockJsonc = {
        register: function register() {}
      };
    });

    it('should register the supplied class', function () {
      var _dec, _class;

      var testTypeName = 'Test';
      var wasCalledWithClassAndTypeName = false;
      var mockJsonc = { register: function register(constructor, typeName) {
          return wasCalledWithClassAndTypeName = constructor.name === 'TestClass' && typeName === testTypeName;
        } };

      var _annotations = (0, _annotations6.default)(mockJsonc);

      var serializable = _annotations.serializable;
      var TestClass = (_dec = serializable(testTypeName), _dec(_class = function TestClass() {
        _classCallCheck(this, TestClass);
      }) || _class);


      wasCalledWithClassAndTypeName.should.be.true;
    });

    it('should register the supplied class with options', function () {
      var _dec2, _class2;

      var testTypeName = 'Test';
      var testOptions = {};
      var wasCalledWithAllArguments = false;
      var mockJsonc = { register: function register(constructor, typeName, options) {
          return wasCalledWithAllArguments = constructor.name === 'TestClass' && typeName === testTypeName && options === testOptions;
        } };

      var _annotations2 = (0, _annotations6.default)(mockJsonc);

      var serializable = _annotations2.serializable;
      var TestClass = (_dec2 = serializable(testTypeName, testOptions), _dec2(_class2 = function TestClass() {
        _classCallCheck(this, TestClass);
      }) || _class2);


      wasCalledWithAllArguments.should.be.true;
    });

    it('should throw an error if no class name is supplied', function () {
      var _annotations3 = (0, _annotations6.default)();

      var serializable = _annotations3.serializable;


      serializable.should.throw(/type name must be supplied/);
    });

    it('should throw an error if no class name is supplied', function () {
      var _annotations4 = (0, _annotations6.default)();

      var serializable = _annotations4.serializable;


      try {
        var _class3;

        var TestClass = serializable(_class3 = function TestClass() {
          _classCallCheck(this, TestClass);
        }) || _class3;
      } catch (ex) {
        ex.message.should.match(/type name must be supplied/);
      }
    });
  });
});

//# sourceMappingURL=annotations.tests.js.map