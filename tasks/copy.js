"use strict";

const gulp = require("gulp");

module.exports = function () {
    gulp.src("src/*.html")
        .pipe(gulp.dest("build"))
        .pipe(gulp.dest("dist"));
};