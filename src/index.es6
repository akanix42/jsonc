import Annotations from './annotations';
import Jsonc from './jsonc';

const jsonc = new Jsonc();
export default jsonc;

import setJsonc from './annotations';
setJsonc(jsonc);
export * from './annotations';

export { default as Deserializer } from './deserializer';
export { default as Serializer } from './serializer';
