"use strict";
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const execute = Promise.coroutine(function* (data) {
    const count = yield index_1.constructed.instance.feed.getFollowersCount(data.akashaId);
    return { count, akashaId: data.akashaId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getFollowersCount' };
//# sourceMappingURL=followers-count.js.map