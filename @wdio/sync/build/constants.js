"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STACKTRACE_FILTER_FN = void 0;
const STACK_START = /^\s+at /;
const STACKTRACE_FILTER = [
    'node_modules/@wdio/sync/',
    'node_modules/webdriverio/build/',
    'node_modules/webdriver/build/',
    'node_modules/request/request',
    ' (events.js:',
    ' (domain.js:',
    '(internal/process/next_tick.js',
    'new Promise (<anonymous>)',
    'Generator.next (<anonymous>)',
    '__awaiter ('
];
exports.STACKTRACE_FILTER_FN = (stackRow) => {
    if (stackRow.match(STACK_START)) {
        return !STACKTRACE_FILTER.some(r => stackRow.includes(r));
    }
    return true;
};
