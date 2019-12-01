const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcPath = 'src/main/js';
const outputPath = 'target/classes/static/js';

module.exports = {
    entry: path.join(__dirname, srcPath, 'index.js'),
    output: {
        path: path.join(__dirname, outputPath),
        filename: 'index.bundle.js'
    },
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        modules: [
            path.resolve(__dirname, srcPath),
            'node_modules'
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, srcPath)
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }, {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                loaders: ['file-loader']
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/main/resources/templates', 'index.html')
    })]
};
