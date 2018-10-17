var path = require('path');
var webpack = require('webpack');
var vendorsConfig = require('./webpack.vendors.config.js');
var proxy = require('./proxy');

var moduleName = process.env['MODULE'];

var SRC_PATH = path.join(__dirname, moduleName, 'src');
var DIST_PATH = path.join(__dirname, moduleName, 'static');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    entry: {
        apps: path.join(SRC_PATH, 'root.js'),
        vendors: vendorsConfig.libs
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
        filename: 'js/[name].js',
        chunkFilename: `js/[name].js`
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            '__DEV__': true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors']
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true
        }),

        new webpack.optimize.UglifyJsPlugin({
            comments: true,
            warnings: true
        }),

        new HtmlWebpackPlugin({
            favicon: './common/layouts/images/logo-70x70.png',
            inject: false,
            filename: './index.html',
            template: path.join(SRC_PATH, 'index.html')
        })
    ],

    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [SRC_PATH],
            options: {
                formatter: require('eslint-friendly-formatter')
            }
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            // include: SRC_PATH,
            exclude: /node_modules/

        },
        {
            test: /\.css$/,
            use: ['style-loader',
                'css-loader',
                'autoprefixer-loader'
            ]
        },

        {
            test: /\.less$/,
            use: ['style-loader',
                'css-loader',
                'autoprefixer-loader',
                'less-loader'
            ]
        },

        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },

        {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: 'images/[name].[ext]'
            }
        },

        {
            test: /\.(eot|woff|woff2|ttf|svg)/,
            loader: 'url-loader',
            options: {
                limit: 50,
                name: 'fonts/[name].[ext]'
            },
            exclude: [/home-banner\.svg/]
        }
        ]
    },

    devServer: {
        proxy: proxy,
        overlay: true,
        disableHostCheck: true
    }
};

console.log('initializing webpack developent build....');

module.exports = config;
