import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

/**
 * Get a tags created
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { toBlock: number, limit?: number }) {
    const collection = [];
    const maxResults = data.limit || 5;
    const fetched = yield contracts.fromEvent(contracts.instance.ProfileRegistrar.TagCreate, {}, data.toBlock, maxResults);
    for (let event of fetched.results) {
        collection.push({tag: event.args.tag});
    }
    return { collection: collection, lastBlock: fetched.fromBlock };
});

export default { execute, name: 'tagIterator' };

