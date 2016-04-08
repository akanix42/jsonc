import "babel-polyfill";

import Annotations from './annotations';
import Jsonc from './jsonc';

const jsonc = new Jsonc();
export default jsonc;

const annotations = new Annotations(jsonc);
export let { serializable } = annotations;