"use strict";
const index_1 = require("./auth/index");
function initModules() {
    if (!index_1.module.auth) {
        index_1.module.init();
    }
}
exports.initModules = initModules;
//# sourceMappingURL=index.js.map