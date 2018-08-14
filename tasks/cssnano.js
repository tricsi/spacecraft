"use strict";

const gulp = require("gulp");
const cssnano = require("gulp-cssnano");

module.exports = function () {
    return gulp.src("build/*.css")
        .pipe(cssnano())
        .pipe(gulp.dest("dist"));
};