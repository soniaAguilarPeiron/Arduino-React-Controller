const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "src/index.jsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    optimization: {
        minimize: false
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./index.html",
            filename: "./index.html"
        })
    ]
    ,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: 9000
    }
};
