"use strict";

const gulp = require("gulp");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

module.exports = function () {
    return gulp.src("src/*.pcss")
        .pipe(sourcemaps.init())
        .pipe(postcss())
        .pipe(rename({extname:".css"}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build"));
};