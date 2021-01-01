"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.touchAction = exports.validateParameters = exports.formatArgs = void 0;
const TOUCH_ACTIONS = ['press', 'longPress', 'tap', 'moveTo', 'wait', 'release'];
const POS_ACTIONS = TOUCH_ACTIONS.slice(0, 4);
const ACCEPTED_OPTIONS = ['x', 'y', 'element'];
exports.formatArgs = function (scope, actions) {
    return actions.map((action) => {
        if (Array.isArray(action)) {
            return exports.formatArgs(scope, action);
        }
        if (typeof action === 'string') {
            action = { action };
        }
        const formattedAction = {
            action: action.action,
            options: {}
        };
        const actionElement = action.element && typeof action.element.elementId === 'string'
            ? action.element.elementId
            : scope.elementId;
        if (POS_ACTIONS.includes(action.action) && formattedAction.options && actionElement) {
            formattedAction.options.element = actionElement;
        }
        if (formattedAction.options && typeof action.x === 'number' && isFinite(action.x))
            formattedAction.options.x = action.x;
        if (formattedAction.options && typeof action.y === 'number' && isFinite(action.y))
            formattedAction.options.y = action.y;
        if (formattedAction.options && action.ms)
            formattedAction.options.ms = action.ms;
        if (formattedAction.options && Object.keys(formattedAction.options).length === 0) {
            delete formattedAction.options;
        }
        return formattedAction;
    });
};
exports.validateParameters = (params) => {
    const options = Object.keys(params.options || {});
    if (params.action === 'release' && options.length !== 0) {
        throw new Error('action "release" doesn\'t accept any options ' +
            `("${options.join('", "')}" found)`);
    }
    if (params.action === 'wait' &&
        (options.includes('x') || options.includes('y'))) {
        throw new Error('action "wait" doesn\'t accept x or y options');
    }
    if (POS_ACTIONS.includes(params.action)) {
        for (const option in params.options) {
            if (!ACCEPTED_OPTIONS.includes(option)) {
                throw new Error(`action "${params.action}" doesn't accept "${option}" as option`);
            }
        }
        if (options.length === 0) {
            throw new Error(`Touch actions like "${params.action}" need at least some kind of ` +
                'position information like "element", "x" or "y" options, you\'ve none given.');
        }
    }
};
exports.touchAction = function (actions) {
    if (!this.multiTouchPerform || !this.touchPerform) {
        throw new Error('touchAction can be used with Appium only.');
    }
    if (!Array.isArray(actions)) {
        actions = [actions];
    }
    const formattedAction = exports.formatArgs(this, actions);
    const protocolCommand = Array.isArray(actions[0])
        ? this.multiTouchPerform.bind(this)
        : this.touchPerform.bind(this);
    formattedAction.forEach((params) => exports.validateParameters(params));
    return protocolCommand(formattedAction);
};
