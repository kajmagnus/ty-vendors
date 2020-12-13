"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberError = exports.enhanceErrorBe = exports.enhanceError = exports.not = exports.getSelectors = exports.getSelector = void 0;
const jest_matcher_utils_1 = require("jest-matcher-utils");
const EXPECTED_LABEL = 'Expected';
const RECEIVED_LABEL = 'Received';
const NOT_SUFFIX = ' [not]';
const NOT_EXPECTED_LABEL = EXPECTED_LABEL + NOT_SUFFIX;
exports.getSelector = (el) => {
    let result = typeof el.selector === 'string' ? el.selector : '<fn>';
    if (Array.isArray(el) && el.props.length > 0) {
        result += ', <props>';
    }
    return result;
};
exports.getSelectors = (el) => {
    const selectors = [];
    let parent;
    if (Array.isArray(el)) {
        selectors.push(`${el.foundWith}(\`${exports.getSelector(el)}\`)`);
        parent = el.parent;
    }
    else {
        parent = el;
    }
    while (parent && 'selector' in parent) {
        const selector = exports.getSelector(parent);
        const index = parent.index ? `[${parent.index}]` : '';
        selectors.push(`${parent.index ? '$' : ''}$(\`${selector}\`)${index}`);
        parent = parent.parent;
    }
    return selectors.reverse().join('.');
};
exports.not = (isNot) => {
    return `${isNot ? 'not ' : ''}`;
};
exports.enhanceError = (subject, expected, actual, context, verb, expectation, arg2 = '', { message = '', containing = false }) => {
    const { isNot = false } = context;
    subject = typeof subject === 'string' ? subject : exports.getSelectors(subject);
    let contain = '';
    if (containing) {
        contain = ' containing';
    }
    if (verb) {
        verb += ' ';
    }
    let diffString;
    if (isNot && actual === expected) {
        diffString = `${EXPECTED_LABEL}: ${jest_matcher_utils_1.printExpected(expected)}\n` +
            `${RECEIVED_LABEL}: ${jest_matcher_utils_1.printReceived(actual)}`;
    }
    else {
        diffString = jest_matcher_utils_1.printDiffOrStringify(expected, actual, EXPECTED_LABEL, RECEIVED_LABEL, true);
    }
    if (isNot) {
        diffString = diffString
            .replace(EXPECTED_LABEL, NOT_EXPECTED_LABEL)
            .replace(RECEIVED_LABEL, RECEIVED_LABEL + ' '.repeat(NOT_SUFFIX.length));
    }
    if (message) {
        message += '\n';
    }
    if (arg2) {
        arg2 = ` ${arg2}`;
    }
    const msg = `${message}Expect ${subject} ${exports.not(isNot)}to ${verb}${expectation}${arg2}${contain}\n\n${diffString}`;
    return msg;
};
exports.enhanceErrorBe = (subject, pass, context, verb, expectation, options) => {
    return exports.enhanceError(subject, exports.not(context.isNot) + expectation, exports.not(!pass) + expectation, context, verb, expectation, '', options);
};
exports.numberError = (gte, lte, eq) => {
    if (typeof eq === 'number') {
        return eq;
    }
    let error = '';
    error = `>= ${gte}`;
    error += lte ? ` && <= ${lte}` : '';
    return error;
};
