const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './scripts/Main.js',
    watch: true,
    module: {
        rules: [
            {
                test: /\.ts?&/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader:'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../styles/styles.css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin()
    ],
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../output/client/scripts')
    }
}
