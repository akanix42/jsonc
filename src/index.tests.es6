import Jsonc from './jsonc';
import jsonc, * as exports from './index';

import chai from 'chai';
chai.should();

describe('index', () => {

  it('should export a Jsonc instance', ()=> {
    jsonc.should.be.instanceof(Jsonc);
  });

  it('should export the serializable annotation', ()=> {
    exports.should.have.property('serializable');
  });

});
