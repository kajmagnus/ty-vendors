"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getElementObject_1 = require("../../utils/getElementObject");
const constants_1 = require("../../constants");
async function custom$(strategyName, ...strategyArguments) {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
        throw Error('No strategy found for ' + strategyName);
    }
    let res = await this.execute(strategy, ...strategyArguments);
    if (Array.isArray(res)) {
        res = res[0];
    }
    if (res && typeof res[constants_1.ELEMENT_KEY] === 'string') {
        return await getElementObject_1.getElement.call(this, strategy.toString(), res);
    }
    throw Error('Your locator strategy script must return an element');
}
exports.default = custom$;
