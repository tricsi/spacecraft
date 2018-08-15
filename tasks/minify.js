"use strict";

const gulp = require("gulp");
const minify = require("gulp-minify");
const livereload = require("gulp-livereload");

module.exports = function () {
    return gulp.src("build/*.js")
        .pipe(minify({
            ext: {
                min:'.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest("dist"))
        .pipe(livereload());
};