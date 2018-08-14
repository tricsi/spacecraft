"use strict";

const gulp = require("gulp");

gulp.task("copy", require('./tasks/copy'));
gulp.task("postcss", require('./tasks/postcss'));
gulp.task("typescript", require('./tasks/typescript'));
gulp.task("cssnano", ["postcss"], require('./tasks/cssnano'));
gulp.task("minify", ["typescript"], require('./tasks/minify'));
gulp.task("zip", ["cssnano", "minify", "copy"], require('./tasks/zip'));
gulp.task("default", ["zip"]);
gulp.task("watch", ["zip"], function () {
    gulp.watch("src/**/*.ts", ["minify"]);
    gulp.watch("src/**/*.pcss", ["cssnano"]);
    gulp.watch("src/**/*.html", ["copy"]);
});
