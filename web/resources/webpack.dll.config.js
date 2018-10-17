/* webpack --config  webpack.dll.config.js --progress */
// const path = require('path');
const webpack = require('webpack');
const vendors = require('./webpack.vendors.config.js');
const CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';

module.exports = {
    devtool: 'source-map',
    entry: {
        vendors: vendors.libs
    },
    output: {
        path: vendors.path,
        filename: `[name]${CHUNK_FILE_HASH_TAG}.js`,
        library: `[name]${CHUNK_FILE_HASH_TAG}`
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'vendors_manifest.json',
            name: `[name]${CHUNK_FILE_HASH_TAG}`,
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['$', 'exports', 'require']
            },
            exclude: /\.min\.js$/,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ]
};
