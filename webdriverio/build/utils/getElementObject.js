"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElements = exports.getElement = void 0;
const utils_1 = require("@wdio/utils");
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
const _1 = require(".");
const middlewares_1 = require("../middlewares");
const constants_1 = require("../constants");
exports.getElement = function findElement(selector, res, isReactElement = false) {
    const browser = _1.getBrowserObject(this);
    const propertiesObject = {
        ...lodash_clonedeep_1.default(browser.__propertiesObject__),
        ..._1.getPrototype('element'),
        scope: { value: 'element' }
    };
    const element = utils_1.webdriverMonad(this.options, (client) => {
        const elementId = _1.getElementFromResponse(res);
        if (elementId) {
            client.elementId = elementId;
            if (this.isW3C) {
                client[constants_1.ELEMENT_KEY] = elementId;
            }
            else {
                client.ELEMENT = elementId;
            }
        }
        else {
            client.error = res;
        }
        client.selector = selector;
        client.parent = this;
        client.emit = this.emit.bind(this);
        client.isReactElement = isReactElement;
        return client;
    }, propertiesObject);
    const elementInstance = element(this.sessionId, middlewares_1.elementErrorHandler(utils_1.wrapCommand));
    const origAddCommand = elementInstance.addCommand.bind(elementInstance);
    elementInstance.addCommand = (name, fn) => {
        browser.__propertiesObject__[name] = { value: fn };
        origAddCommand(name, utils_1.runFnInFiberContext(fn));
    };
    return elementInstance;
};
exports.getElements = function getElements(selector, elemResponse, isReactElement = false) {
    const browser = _1.getBrowserObject(this);
    const propertiesObject = {
        ...lodash_clonedeep_1.default(browser.__propertiesObject__),
        ..._1.getPrototype('element')
    };
    const elements = elemResponse.map((res, i) => {
        propertiesObject.scope = { value: 'element' };
        const element = utils_1.webdriverMonad(this.options, (client) => {
            const elementId = _1.getElementFromResponse(res);
            if (elementId) {
                client.elementId = elementId;
                const elementKey = this.isW3C ? constants_1.ELEMENT_KEY : 'ELEMENT';
                client[elementKey] = elementId;
            }
            else {
                client.error = res;
            }
            client.selector = selector;
            client.parent = this;
            client.index = i;
            client.emit = this.emit.bind(this);
            client.isReactElement = isReactElement;
            return client;
        }, propertiesObject);
        const elementInstance = element(this.sessionId, middlewares_1.elementErrorHandler(utils_1.wrapCommand));
        const origAddCommand = elementInstance.addCommand.bind(elementInstance);
        elementInstance.addCommand = (name, fn) => {
            browser.__propertiesObject__[name] = { value: fn };
            origAddCommand(name, utils_1.runFnInFiberContext(fn));
        };
        return elementInstance;
    });
    return elements;
};
