"use strict";

const gulp = require("gulp");
const livereload = require("gulp-livereload");

module.exports = function () {
    gulp.src("src/*.html")
        .pipe(gulp.dest("build"))
        .pipe(gulp.dest("dist"))
        .pipe(livereload());
};