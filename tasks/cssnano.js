"use strict";

const gulp = require("gulp");
const cssnano = require("gulp-cssnano");
const livereload = require("gulp-livereload");

module.exports = function () {
    return gulp.src("build/*.css")
        .pipe(cssnano())
        .pipe(gulp.dest("dist"))
        .pipe(livereload());
};