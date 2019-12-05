const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};

module.exports = function(api) {
    api.cache(true);
    
    var env = process.env.NODE_ENV;
    var presets = [
        '@babel/preset-react'
    ];
    var plugins = [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-optional-chaining',
        ['babel-plugin-module-resolver', {
            alias: {
                '^constants/(.+)': './src/constants/\\1',
                '^images/(.+)': './src/images/\\1',
                '^utils/(.+)': './src/utils/\\1'
            }
        }]
    ];

    switch (env) {
        case ENV.DEVELOPMENT:
        case ENV.PRODUCTION:        
            presets.push(        
                ['@babel/preset-env', {
                    'targets': [
                        'last 2 version',
                        'ie >= 9'
                    ],
                    modules: false // transform esm to cjs, false to keep esm.
                }]
            );
            break;
        case ENV.TEST:
            presets.push('@babel/preset-env');
            break;
    }

    return {
        presets,
        plugins
    };
};