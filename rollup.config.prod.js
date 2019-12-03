import { uglify } from 'rollup-plugin-uglify';
import base, { rollupMerge } from './rollup.config.base';
import pkg from './package.json';

const EXPORTS = 'auto'; // 如果本库既包含命名导出又包含默认导出则使用'named'参数(if you use named exports but also have a default export use 'named').
var { main, module, browser, libraryName } = pkg;
var cjsName = main.split('/')[1];
var esmName = module.split('/')[1];
var umdName = browser.split('/')[1];

export default [rollupMerge(base(umdName), {
    output: {
        format: 'umd',
        sourcemap: true,
        name: libraryName,     
        exports: EXPORTS
        // globals: {           // for external imports
        //     react: 'React'
        // }
    },
    plugins: [
        uglify()	                     
    ]
}), rollupMerge(base(cjsName), {
    output: {
        format: 'cjs',
        exports: EXPORTS
    }
}), rollupMerge(base(esmName), {
    output: {
        format: 'es'
    }
})];