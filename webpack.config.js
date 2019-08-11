"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { execFile } = require("child_process");
const advzip = require("advzip-bin");
const path = require("path");
const fs = require("fs");

const distDir = path.resolve(__dirname, "dist");
const isDev = process.env.npm_lifecycle_event !== "build";

class AdvzipPlugin {

    constructor(options) {
        this.opt = options;
    }

    apply(compiler) {
        compiler.hooks.done.tap("advzip", () => {
            if (this.opt.disabled) {
                return;
            }
            const args = ["-a4", this.opt.out].concat(this.opt.files);
            execFile(advzip, args, {cwd: this.opt.cwd}, () => {
                const out = path.resolve(this.opt.cwd, this.opt.out);
                const stats = fs.statSync(out);
                console.log(`Advzip: ${stats.size}`);
            });
        });
    }
}

module.exports = {

    entry: "./src/main.ts",

    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },

    devtool: "source-map",

    output: {
        path: distDir,
        filename: "main_bundle.js"
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
        contentBase: distDir,
        stats: "minimal",
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
        new AdvzipPlugin({
            cwd: distDir,
            out: "game.zip",
            files: ["index.html"],
            disabled: isDev
        })
    ]
};
