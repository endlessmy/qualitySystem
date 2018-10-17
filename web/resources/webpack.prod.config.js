var path = require('path');
// var vendors_config = require('./webpack.vendors.config.js');
const vendorsManifest = require('./vendors_manifest.json');
var webpack = require('webpack');

var moduleName = process.env['MODULE'];

var SRC_PATH = path.join(__dirname, moduleName, 'src');
var DIST_PATH = path.join(__dirname, '..', 'static', moduleName);
var CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';
var HASH_TAG = '_[hash:5]';
// let CONTENT_HASH_TAG = '_[contenthash:5]';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackChunkHash = require('webpack-chunk-hash');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var config = {
    entry: {
        apps: path.join(SRC_PATH, 'root.js')
    },

    resolve: {
        modules: [SRC_PATH, 'node_modules'],
        alias: {
            'resources': path.resolve('../resources'),
            '@': path.resolve(SRC_PATH),
            'common': path.join(__dirname, 'common'),
            'select2': path.join(__dirname, 'common/vendors/select2', 'js/select2'),
            'jquery.fileupload': path.join(__dirname, 'node_modules', 'blueimp-file-upload/js/jquery.fileupload'),
            'jquery.iframe-transport': path.join(__dirname, 'node_modules', 'blueimp-file-upload/js/jquery.iframe-transport'),
            'jquery-ui': path.join(__dirname, 'node_modules', 'jquery-ui'),
            'jquery.ui.widget': path.join(__dirname, 'node_modules', 'blueimp-file-upload/js/vendor/jquery.ui.widget')
        },
        extensions: ['.less', '.css', '.js', '.vue', '.json']
    },

    output: {
        path: DIST_PATH,
        // publicPath: '',
        filename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`,
        chunkFilename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`
    },

    plugins: [
        new CleanWebpackPlugin(DIST_PATH, {
            root: path.join(__dirname, '../'),
            verbose: true,
            exclude: ['vendors']
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            '__DEV__': false
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest' //, 'manifest'
        }),

        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: vendorsManifest
        }),

        new webpack.HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new InlineManifestWebpackPlugin({
            name: 'webpackManifest'
        }),

        new ExtractTextPlugin(`css/commons${CHUNK_FILE_HASH_TAG}.css`),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            warnings: false
        }),

        new HtmlWebpackPlugin({
            chunks: ['apps'],
            vendors_path: `../common/js/${vendorsManifest.name}.js`,
            favicon: './common/layouts/images/logo-70x70.png',
            inject: false,
            filename: path.join(DIST_PATH, 'index.html'),
            template: path.join(SRC_PATH, 'index.prod.html')
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: 'disable' // server|disable
        })
    ],

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },

        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'autoprefixer-loader']
        },

        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                postcss: [require('autoprefixer')({
                    browsers: ['last 3 versions']
                })],

                loaders: {
                    less: ExtractTextPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: 'css-loader?minimize!less-loader',
                        publicPath: '../'
                    })
                }

            }
        },

        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: `images/[name].[ext]?${HASH_TAG}`
            },
            exclude: [/weixin-(.*)code\.png/]
        },
        {
            test: /weixin-(.*)code\.png$/,
            loader: 'file-loader',
            options: {
                name: `../common/images/[name].[ext]?${HASH_TAG}`
            }
        },
        {
            test: /\.(eot|woff|woff2|ttf|svg)/,
            loader: 'url-loader',
            options: {
                limit: 50,
                name: `fonts/[name].[ext]?${HASH_TAG}`
            },
            exclude: [/home-banner\.svg/]
        }
        ]
    }
};

if (moduleName === 'document') {
    var copyVendorsPlugin = new CopyWebpackPlugin([{
        from: path.join(SRC_PATH, 'vendors'),
        to: path.join(DIST_PATH, 'vendors')
    }]);

    config.plugins.push(copyVendorsPlugin);
}

module.exports = config;
