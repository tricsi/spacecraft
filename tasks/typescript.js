"use strict";

const fs = require("fs");
const gulp = require("gulp");
const typescript = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const config = JSON.parse(fs.readFileSync('./tsconfig.json'));

module.exports = function (cb) {
    return gulp.src(config.include)
        .pipe(sourcemaps.init())
        .pipe(typescript(config.compilerOptions))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
};