import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import base, { rollupMerge } from './rollup.config.base';
import pkg from './package.json';

const { local } = pkg.devEnvironments.servers;

export default rollupMerge(base(), {
    output: {
        format: 'iife',
        sourcemap: true
    },
    plugins: [
        json(),
        postcss(),
        // web服务
        serve({
            host: '0.0.0.0',
            port: local,
            contentBase: ['build', 'test'],
            openPage: 'index.html',
            historyApiFallback: 'index.html'
        }),
        htmlTemplate({
            template: 'test/template.html',
            target: 'index.html'
        }),
        // 全局变量
        replace({
            __DEV__: true,
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
});