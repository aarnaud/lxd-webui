const {ForkCheckerPlugin} = require('awesome-typescript-loader');
const webpack = require('webpack');
const path = require('path');


function webpackConfig(options: EnvOptions = {}): WebpackConfig {

    return {
        cache: true,

        entry: {
            polyfills: './src/polyfills',
            vendor:    './src/vendor',
            main:      './src/main',
        },

        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[name].map',
            chunkFilename: '[id].chunk.js'
        },

        module: {
            loaders: [
                // Support for .ts files.
                { test: /\.ts$/,   loader: 'awesome-typescript-loader' },
                { test: /\.json$/, loader: 'json-loader' },
                { test: /\.html/,  loader: 'raw-loader' },
                { test: /\.css$/,  loader: 'raw-loader' },
            ]
        },


        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new ForkCheckerPlugin(),
            new webpack.optimize.CommonsChunkPlugin({ name: ['main', 'vendor', 'polyfills'], minChunks: Infinity }),
            new webpack.DefinePlugin({
                ENV: JSON.stringify(options.ENV),
                HMR: false
            })
        ],

        // devtool: 'source-map',
        devtool: 'cheap-module-eval-source-map',
        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },

        devServer: {
            contentBase: './src',
            port: 3000,
            // hot: options.HMR, // there are problems with HMR at the moment
            historyApiFallback: true
        },

        node: {
            global: true,
            process: true,
            Buffer: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false,
            clearTimeout: true,
            setTimeout: true
        }
    };
}


// Export
module.exports = logOptions(webpackConfig);






function logOptions(fn) {
    return function(options: EnvOptions = {}) {
        console.log('Env Options: ', JSON.stringify(options, null, 2));
        return fn(options);
    };
}

// Types
type Entry = Array<string> | Object;

type Output = Array<string> | {
    path: string,
    filename: string
};

type EnvOptions = any;

interface WebpackConfig {
    cache?: boolean;
    devtool?: string;
    entry: Entry;
    output: any;
    module?: {
        loaders?: Array<any>
    };
    plugins?: Array<any>;
    resolve?: {
        extensions?: Array<string>;
    };
    devServer?: {
        contentBase?: string;
        port?: number;
        historyApiFallback?: boolean;
        hot?: boolean;
    };
    node?: {
        process?: boolean;
        global?: boolean;
        Buffer?: boolean;
        crypto?: string | boolean;
        module?: boolean;
        clearImmediate?: boolean;
        setImmediate?: boolean
        clearTimeout?: boolean;
        setTimeout?: boolean
    };
}