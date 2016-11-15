import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';
import profileData from './profile-data';
/**
 * Get followed profiles of id
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {start?: number, limit?: number, akashaId: string }) {
    let currentId = (data.start) ? data.start : yield contracts.instance.feed.getFollowingFirst(data.akashaId);
    if (currentId === '0') {
        return { collection: [], akashaId: data.akashaId };
    }
    let profileId = yield contracts.instance.feed.getFollowingById(data.akashaId, currentId);
    let profile = yield profileData.execute({ profile: profileId });
    const maxResults = (data.limit) ? data.limit : 10;
    const results = [{ profile, address: profileId }];
    let counter = 1;
    while (counter < maxResults) {
        currentId = yield contracts.instance.feed.getFollowingNext(data.akashaId, currentId);
        if (currentId === '0') {
            break;
        }
        profileId = yield contracts.instance.feed.getFollowersById(data.akashaId, currentId);
        profile = yield profileData.execute({ profile: profileId });
        results.push({ profile, address: profileId });
        counter++;
    }
    return { collection: results, akashaId: data.akashaId };
});

export default { execute, name: 'followingIterator' };
