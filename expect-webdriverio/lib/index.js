"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = void 0;
const addMatchers_1 = require("./addMatchers");
addMatchers_1.addMatchers();
exports.setOptions = require('./options').setDefaultOptions;
