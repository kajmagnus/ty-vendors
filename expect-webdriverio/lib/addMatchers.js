"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMatchers = exports.loadExpect = exports.isJasmine = void 0;
let expectLib;
exports.isJasmine = () => {
    return Boolean(global.jasmine && global.expect && global.expectAsync && global.jasmine.getEnv && global.jasmine.addMatchers && global.jasmine.addAsyncMatchers);
};
exports.loadExpect = () => {
    try {
        return expectLib = require('expect');
    }
    catch (err) {
        return console.error('Failed to load expect package. Make sure it has been installed: npm i expect');
    }
};
exports.addMatchers = () => {
    if (global.expect === undefined) {
        if (!exports.loadExpect()) {
            return;
        }
        global.expect = expectLib;
    }
    else {
        expectLib = global.expect;
    }
    if (!global.expect.extend && !exports.isJasmine()) {
        if (!exports.loadExpect()) {
            return;
        }
        global.expectWdio = expectLib;
        console.warn('Warning! Unsupported expect lib is used.\n' +
            "Only Jasmine >= 3.3.0 and Jest's expect are supported.\n" +
            "expect-webdriverio is assigned to global.expectWdio");
    }
    require('./options').setDefaultOptions;
    const matchers = require('./matchers').default;
    if (expectLib.extend) {
        return expectLib.extend({ ...matchers });
    }
    expectLib = global.jasmine;
    return expectLib.getEnv().beforeAll(function addExpectWebdriverIOMatchers() {
        expectLib.addMatchers({ ...matchers });
        expectLib.addAsyncMatchers({ ...matchers });
    });
};
