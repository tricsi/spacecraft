"use strict";

const gulp = require("gulp");
const zip = require("gulp-zip");
const size = require("gulp-size");

module.exports = function () {
    return gulp.src(["dist/index.html", "dist/script.js", "dist/style.css"])
        .pipe(zip("dist.zip"))
        .pipe(size({ title: "Build", pretty: false }))
        .pipe(gulp.dest("."));
};