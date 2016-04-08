'use strict';

require('babel-polyfill');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _annotations4 = require('./annotations');

var _annotations5 = _interopRequireDefault(_annotations4);

var _autobindDecorator = require('autobind-decorator');

var _autobindDecorator2 = _interopRequireDefault(_autobindDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_chai2.default.should();

describe('Annotations', function () {
  describe('serializable', function () {
    var mockJsonc = undefined;
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

      var _annotations = (0, _annotations5.default)(mockJsonc);

      var serializable = _annotations.serializable;
      var TestClass = (_dec = serializable(testTypeName), _dec(_class = function TestClass() {
        _classCallCheck(this, TestClass);
      }) || _class);

      wasCalledWithClassAndTypeName.should.be.true;
    });

    it('should throw an error if no class name is supplied', function () {
      var _annotations2 = (0, _annotations5.default)();

      var serializable = _annotations2.serializable;

      serializable.should.throw(/type name must be supplied/);
    });

    it('should throw an error if no class name is supplied', function () {
      var _annotations3 = (0, _annotations5.default)();

      var serializable = _annotations3.serializable;

      try {
        var _class2;

        var TestClass = serializable(_class2 = function TestClass() {
          _classCallCheck(this, TestClass);
        }) || _class2;
      } catch (ex) {
        ex.message.should.match(/type name must be supplied/);
      }
    });
  });
});

//# sourceMappingURL=annotations.tests.js.map