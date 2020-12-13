"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (_, script, scriptTimeout, dataProperty, dataFlag, ...commandArgs) => {
    return new Promise((_resolve, _reject) => {
        setTimeout(() => _reject('script timeout'), scriptTimeout);
        window.arguments = [...commandArgs, (result) => {
                let tmpResult = result instanceof NodeList ? Array.from(result) : result;
                const isResultArray = Array.isArray(tmpResult);
                tmpResult = isResultArray ? tmpResult : [tmpResult];
                if (tmpResult.find((r) => r instanceof HTMLElement)) {
                    tmpResult = tmpResult.map((r, i) => {
                        if (r instanceof HTMLElement) {
                            const dataPropertyValue = `${dataFlag}_${i}`;
                            r.setAttribute(dataProperty, dataPropertyValue);
                            return dataPropertyValue;
                        }
                        return result;
                    });
                }
                return _resolve(isResultArray ? tmpResult : tmpResult[0]);
            }];
        return eval(script);
    });
};
