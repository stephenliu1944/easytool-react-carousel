import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import del from 'rollup-plugin-delete';
import alias from 'rollup-plugin-alias';
import url from 'rollup-plugin-url';
import merge from 'lodash/merge';

export function rollupMerge(base, source) {
    var { plugins: basePlugins = [], ...baseOthers } = base;
    var { plugins: sourcePlugins = [], ...sourceOthers } = source;

    var config = merge({}, baseOthers, sourceOthers);
    config.plugins = basePlugins.concat(sourcePlugins);
    
    return config;
}

export default function(filename = 'index.js') {
    const DEV = process.env.NODE_ENV === 'development';
    const BUILD_PATH = process.env.BUILD_PATH || 'build';
    
    return {
        input: DEV ? 'test/app.js' : 'src/index.js',
        output: {
            file: `${BUILD_PATH}/${filename}`
        },
        external: !DEV && ['react', 'react-dom', 'prop-types'],      // 打包时排除外部依赖包
        /**
         * 注意: 插件配置的顺序会影响代码的编译执行!
         */
        plugins: [
            del({
                targets: `${BUILD_PATH}/${filename}`
            }),
            alias({
                constants: 'src/constants',
                images: 'src/images',
                utils: 'src/utils'
            }),
            // eslint 插件需要放在 babel 插件前面, 否则 fix 后代码会是 babel 编译后的
            eslint({                
                fix: true,
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**/*.js'], 
                configFile: `.eslintrc${ DEV ? '' : '.prod' }.json`
            }),
            babel({
                exclude: 'node_modules/**', // only transpile our source code
                runtimeHelpers: true
            }),
            resolve({
                mainFields: DEV ? ['browser', 'main'] : ['module', 'main']  // 读取第三方库 package.json 文件的入口属性
            }),
            commonjs({
                namedExports: DEV && {
                    'react': ['Component', 'Children'],
                    'react-dom': ['render']
                }
            }), 
            // import file
            url({
                limit: 999999 * 1024                      // only use inline files, don't use copy files.
            })
        ]
    };
}