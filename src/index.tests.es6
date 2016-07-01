import chai from 'chai';
import Jsonc from './jsonc';
import jsonc, * as exports from './index';

describe('index', () => {

  it('should export a Jsonc instance', ()=> {
    jsonc.should.be.instanceof(Jsonc);
  });

  it('should export the serializable annotation', ()=> {
    exports.should.have.property('serializable');
  });

});
