const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
const webpack = require('webpack');

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
    options: {
        production: Boolean(process.env.NODE_ENV === 'production' || argv['production']),
        minifyHtml: Boolean(argv['minify-html']),
        deploy: Boolean(argv['deploy']),
        verbose: Boolean(argv['verbose']),
    },
    paths: {
        cache: './cache',
        deployRoot: '/',
        src: {
            root: './src',
            templates: './src/templates',
            templatesPages: './src/templates/pages',
            js: './src/js',
            styles: './src/styles',
            fonts: './src/fonts',
            webFont: './src/fonts/webfont',
            webfontIcons: './src/webfont-icons',
            images: './src/images',
        },
        dist: {
            root: './dist',
            html: './dist',
            js: './dist/js',
            styles: './dist/css',
            fonts: './dist/fonts',
            images: './dist/images',
        }
    }
};

const pugPages = fs.readdirSync(config.paths.src.templatesPages).filter(file => {
    return !fs.lstatSync(`${config.paths.src.templatesPages}/${file}`).isDirectory()
        && path.extname(file) === '.pug';
});

module.exports = {
    mode: config.options.production ? 'production' : 'development',
    devtool: (config.options.production) ? false : 'inline-source-map',
    entry: {
        app: path.resolve(__dirname, 'src/js/app.js'),
        vendor: path.resolve(__dirname, 'src/js/vendor.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (config.options.production) ? 'js/[name].bundle.min.js' : 'js/[name].bundle.js',
        pathinfo: !config.options.production
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: config.options.cache,
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                type: 'javascript/auto',
                test: /\.modernizrrc$/,
                use: ['modernizr-loader', 'json-loader']
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules)/,
                use: [
                    (config.options.production) ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            config: {
                                path: './postcss.config.js',
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            outputStyle: 'expanded',
                        },
                    }
                ]
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({}),
        // Хак, необходимый для корректной работы конструкции catch в промисах
        new webpack.DefinePlugin({
            '\.catch': '["catch"]',
            production: config.options.production
        }),
        new MiniCssExtractPlugin({
            filename: (config.options.production) ? 'css/[name].bundle.min.css' : 'css/[name].bundle.css',
        }),
        new CopyPlugin([
            {
                from: config.paths.src.fonts,
                to: 'fonts',
                force: true,
            },
            {
                from: config.paths.src.images,
                to: 'images',
                force: true,
            },
        ]),
        ...pugPages.map((page) => {
            return new HtmlWebpackPlugin({
                filename: `${path.parse(page).name}.html`,
                template: `${config.paths.src.templatesPages}/${page}`,
                inject: true
            })
        })
    ],
    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
        }
    },
    devServer: {
        contentBase: [
            ...pugPages.map((page) => `${config.paths.src.templatesPages}/${page}`)
        ],
        watchContentBase: true,
        port: 9000,
        hot: true,
        open: true
    }
};