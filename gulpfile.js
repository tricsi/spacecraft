"use strict";

const gulp = require("gulp");
const livereload = require("gulp-livereload");
const http = require('http');
const st = require('st');


gulp.task("copy", require('./tasks/copy'));
gulp.task("postcss", require('./tasks/postcss'));
gulp.task("typescript", require('./tasks/typescript'));
gulp.task("cssnano", ["postcss"], require('./tasks/cssnano'));
gulp.task("minify", ["typescript"], require('./tasks/minify'));
gulp.task("zip", ["cssnano", "minify", "copy"], require('./tasks/zip'));
gulp.task("default", ["zip"]);
gulp.task("server", function(done) {
    http.createServer(
        st({ path: __dirname + '/build', index: 'index.html', cache: false })
    ).listen(3000, done);
});
gulp.task("watch", ["server"], function () {
    livereload.listen({ basePath: "build" });
    gulp.watch("src/**/*.ts", ["minify"]);
    gulp.watch("src/**/*.pcss", ["cssnano"]);
    gulp.watch("src/**/*.html", ["copy"]);
});
