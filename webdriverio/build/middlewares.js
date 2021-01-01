"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiremoteHandler = exports.elementErrorHandler = void 0;
const refetchElement_1 = __importDefault(require("./utils/refetchElement"));
const implicitWait_1 = __importDefault(require("./utils/implicitWait"));
const constants_1 = require("./constants");
exports.elementErrorHandler = (fn) => (commandName, commandFn) => {
    return function elementErrorHandlerCallback(...args) {
        return fn(commandName, async function elementErrorHandlerCallbackFn() {
            const element = await implicitWait_1.default(this, commandName);
            this.elementId = element.elementId;
            this[constants_1.ELEMENT_KEY] = element.elementId;
            try {
                const result = await fn(commandName, commandFn).apply(this, args);
                if (result && result.error === 'no such element') {
                    const err = new Error();
                    err.name = 'stale element reference';
                    throw err;
                }
                return result;
            }
            catch (error) {
                if (error.name === 'stale element reference') {
                    const element = await refetchElement_1.default(this, commandName);
                    this.elementId = element.elementId;
                    this.parent = element.parent;
                    return await fn(commandName, commandFn).apply(this, args);
                }
                throw error;
            }
        }).apply(this);
    };
};
exports.multiremoteHandler = (wrapCommand) => (commandName) => {
    return wrapCommand(commandName, function (...args) {
        const commandResults = this.instances.map((instanceName) => {
            return this[instanceName][commandName](...args);
        });
        return Promise.all(commandResults);
    });
};
