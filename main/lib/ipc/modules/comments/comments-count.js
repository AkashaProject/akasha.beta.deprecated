"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.comments.getCommentsCount(data.entryId);
    return { count, entryId: data.entryId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'commentsCount' };
//# sourceMappingURL=comments-count.js.map