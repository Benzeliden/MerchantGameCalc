const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var isDevelopment = process.env.NODE_ENV !== 'production';
var isTest = process.env.NODE_ENV === 'test';
console.log('webpack loaded. Env = "' + process.env.NODE_ENV + '" Is development - ', isDevelopment);
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

let distPath = __dirname + "/dist"
let outputFilename
if (isDevelopment) {
    outputFilename = "[name].js"
} else {
    outputFilename = "[name].[hash].js"
}

let extractTextMain = new ExtractTextPlugin({
    filename: "bundle.[hash].css",
    disable: isDevelopment
})
function configurePlugins() {
    let plugins = [];
    if (!isDevelopment) {
        plugins.push(new CleanWebpackPlugin([distPath]))
    }
    if (!isTest) {
        plugins.push(new CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
        }))
    }
    if (!isDevelopment) {
        //let extractTextInitial = new ExtractTextPlugin("initial.[hash].css", { disable: isDevelopment, id: 2 })
        //let initialStylesRegexp = /(initial\-styles|angular\-csp)\.css$/        
    }
    plugins.push(extractTextMain)
    plugins.push(
        new HtmlWebpackPlugin({
            title: 'MerchantCalc - Combat calculator for mobile game Merchant',
            template: 'public/index.html',
            includeGA: !isDevelopment,
            isProduction: !isDevelopment,
            //hash: true
        })
    );
    plugins.push(
        new webpack.DefinePlugin({
            isDevelopment: isDevelopment,
            isTest: isTest
        }));
    return plugins;
}

function configureEntry() {
    var entry = {
        app: "./src/main.js"
    }
    //if (!isTest) {
    entry.vendor = ["angular",
        "@uirouter/angularjs",
        "angular-ui-bootstrap/src/tabs",
        "angular-animate",
        "angular-sanitize",
        "ng-dialog",
        "ui-select"];
    //}

    return entry
}

var webpackConfig = {
    entry: configureEntry(),
    output: {
        filename: outputFilename,
        path: distPath
    },
    devServer: {
        contentBase: distPath,
        hot: true
    },
    externals: {
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                //include: /src/,
                use: {
                    loader: 'babel-loader'
                }

            },
            {
                test: /\.css$/,
                //include: /css/,
                //use: [
                //    'style-loader',
                //    'css-loader']
                use: extractTextMain.extract({
                    fallback: "style-loader",
                    use: ["css-loader?minimize"]
                })

            },
            {
                test: /\.(png|jpg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "./static/images/[name].[hash].[ext]"
                    }
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff)(\?[a-z0-9=\.]+)?$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "./static/fonts/[name].[hash].[ext]"
                    }
                }]
            },
            {
                test: /\.html$/,
                exclude: /public/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "./static/[path][name].[hash].[ext]"
                    }
                }]
            }
        ]
    },
    plugins: configurePlugins()
};

if (isTest) {
    var uglify = new webpack.optimize.UglifyJsPlugin({
        compress: {
            booleans: false,
            collapse_vars: false,
            comparisons: false,
            conditionals: false,
            drop_console: true,
            keep_fnames: true,
            loops: false,
            warnings: false,
        },
        mangle: false,
        keep_fnames: true
    });
    webpackConfig.plugins.push(uglify);
} else if (!isDevelopment) {
    var uglify = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true
        },
        output: {
            comments: false,
        },
    });
    webpackConfig.plugins.push(uglify);
} else {
    webpackConfig.devtool = 'eval-cheap-module-source-map'
}

module.exports = webpackConfig;