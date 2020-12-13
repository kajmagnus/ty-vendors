"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadowFnFactory = void 0;
exports.shadowFnFactory = function (elementSelector, qsAll = false) {
    const strFn = `
    (function() {
      // element has a shadowRoot property
      if (this.shadowRoot) {
        return this.shadowRoot.querySelector${qsAll ? 'All' : ''}('${elementSelector}')
      }
      // fall back to querying the element directly if not
      return this.querySelector${qsAll ? 'All' : ''}('${elementSelector}')
    })`;
    return eval(strFn);
};
