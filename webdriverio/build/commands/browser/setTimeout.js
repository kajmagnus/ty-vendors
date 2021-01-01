"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function setTimeout(timeouts) {
    if (typeof timeouts !== 'object') {
        throw new Error('Parameter for "setTimeout" command needs to be an object');
    }
    const timeoutValues = Object.values(timeouts);
    if (timeoutValues.length && timeoutValues.every(timeout => typeof timeout !== 'number' || timeout < 0 || timeout > Number.MAX_SAFE_INTEGER)) {
        throw new Error('Specified timeout values are not valid integer (see https://webdriver.io/docs/api/browser/setTimeout.html for documentation).');
    }
    const implicit = timeouts.implicit;
    const pageLoad = timeouts['page load'] || timeouts.pageLoad;
    const script = timeouts.script;
    const setTimeouts = this.setTimeouts.bind(this);
    if (!this.isW3C) {
        await Promise.all([
            isFinite(implicit) && setTimeouts('implicit', implicit),
            isFinite(pageLoad) && setTimeouts('page load', pageLoad),
            isFinite(script) && setTimeouts('script', script),
        ].filter(Boolean));
        return;
    }
    return setTimeouts(implicit, pageLoad, script);
}
exports.default = setTimeout;
