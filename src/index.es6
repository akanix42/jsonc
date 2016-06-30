import Annotations from './annotations';
import Jsonc from './jsonc';

const jsonc = new Jsonc();
export default jsonc;

const annotations = new Annotations(jsonc);
let { serializable } = annotations;
export { serializable };

export { default as Deserializer } from './deserializer';
