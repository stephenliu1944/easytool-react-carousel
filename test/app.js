/** 
 * 该类用于开发调试, 打包时会忽略此文件.
 */
import { module1, module2 } from '../src/index';

var _module2 = new module2('World!');
document.querySelector('#app').innerHTML = `<h1>${module1('Hello') + _module2.getMessage()}</h1><h2>DEV: ${__DEV__}</h2>`;