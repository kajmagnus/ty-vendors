"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const USKeyboardLayout_1 = require("puppeteer-core/lib/cjs/puppeteer/common/USKeyboardLayout");
const getElementRect_1 = __importDefault(require("./getElementRect"));
const constants_1 = require("../constants");
const KEY = 'key';
const POINTER = 'pointer';
const sleep = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));
async function performActions({ actions }) {
    const page = this.getPageHandle();
    const lastPointer = {};
    for (const action of actions) {
        if (action.type === null || action.type === 'null') {
            for (const singleAction of action.actions) {
                await sleep(singleAction.duration);
            }
            continue;
        }
        if (action.type === 'key') {
            const skipChars = [];
            for (const singleAction of action.actions) {
                if (singleAction.type === 'pause') {
                    await sleep(singleAction.duration);
                    continue;
                }
                const cmd = singleAction.type.slice(KEY.length).toLowerCase();
                const keyboardFn = page.keyboard[cmd].bind(page.keyboard);
                if (cmd === 'up' && skipChars[0] === singleAction.value) {
                    skipChars.shift();
                    continue;
                }
                if (!USKeyboardLayout_1.keyDefinitions[singleAction.value]) {
                    await page.keyboard.sendCharacter(singleAction.value);
                    skipChars.push(singleAction.value);
                    continue;
                }
                await keyboardFn(singleAction.value);
                continue;
            }
            continue;
        }
        if (action.type === 'pointer') {
            if (action.parameters && action.parameters.pointerType && action.parameters.pointerType !== 'mouse') {
                throw new Error('Currently only "mouse" is supported as pointer type');
            }
            for (const singleAction of action.actions) {
                if (singleAction.type === 'pause') {
                    await sleep(singleAction.duration);
                    continue;
                }
                const cmd = singleAction.type.slice(POINTER.length).toLowerCase();
                const keyboardFn = page.mouse[cmd].bind(page.mouse);
                let { x, y, duration, button, origin } = singleAction;
                if (cmd === 'move') {
                    if (typeof x === 'number' &&
                        typeof y === 'number' &&
                        origin === 'pointer' &&
                        lastPointer.x && lastPointer.y) {
                        x += lastPointer.x;
                        y += lastPointer.y;
                    }
                    if (origin && typeof origin[constants_1.ELEMENT_KEY] === 'string' && typeof x === 'number' && typeof y === 'number') {
                        const elemRect = await getElementRect_1.default.call(this, { elementId: origin[constants_1.ELEMENT_KEY] });
                        x += elemRect.x + (elemRect.width / 2);
                        y += elemRect.y + (elemRect.height / 2);
                    }
                    lastPointer.x = x;
                    lastPointer.y = y;
                    await keyboardFn(x, y, { steps: 10 });
                    continue;
                }
                else {
                    const pptrButton = (button === 1 ? 'middle' : (button === 2 ? 'right' : 'left'));
                    await keyboardFn({ button: pptrButton });
                }
                if (duration) {
                    await sleep(duration);
                }
                continue;
            }
            continue;
        }
        throw new Error(`Unknown action type ("${action.type}"), allowed are only: null, key and pointer`);
    }
}
exports.default = performActions;
