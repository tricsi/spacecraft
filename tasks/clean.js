"use strict";

const del = require("del");

module.exports = function () {
    return del(["build/*", "dist/*"]);
}