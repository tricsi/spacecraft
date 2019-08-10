"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const path = require("path");

const distDir = path.resolve(__dirname, "dist");
const isDev = process.env.npm_lifecycle_event !== 'build';

module.exports = {

    entry: "./src/main.ts",

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    devtool: "source-map",

    output: {
        path: distDir,
        filename: 'main_bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDev
                        }
                    }
                ]
            },
            {
                test: /\.glsl$/,
                use: "glsl-minify-loader"
            }
        ]
    },

    devServer: {
        contentBase: "./dist",
        stats: 'minimal',
        overlay: true
    },

    optimization: {
        minimizer: [
            new TerserWebpackPlugin(),
            new OptimizeCSSAssetsPlugin()
        ]
    },

    plugins: [
        new CleanWebpackPlugin({
            dry: isDev
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inlineSource: ".(js|css)$",
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new CompressionPlugin({
            include: /\.html$/
        })
    ]
};
