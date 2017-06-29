import { Map } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants';
import { EntryContent, EntryEth, EntryPageOverlay, EntryRecord,
    EntryState } from './records';

const initialState = new EntryState();

const getEntryRecord = (entry) => {
    let record = new EntryRecord(entry);
    if (entry.content) {
        record = record.set('content', new EntryContent(entry.content));
    }
    record = record.set('entryEth', new EntryEth(entry.entryEth));
    if (entry.entryEth.publisher) {
        // only keep a reference to the publisher's akashaId
        record = record.setIn(['entryEth', 'publisher'], entry.entryEth.publisher.akashaId);
    }
    return record;
};

const entryIteratorHandler = (state, { data }) => {
    let byId = state.get('byId');
    const moreEntries = data.limit === data.collection.length;
    data.collection.forEach((entry, index) => {
        // the request is made for n + 1 entries to determine if there are more entries left
        // if this is the case, ignore the extra entry
        if (!moreEntries || index !== data.collection.length - 1) {
            let newEntry = getEntryRecord(entry);
            const oldContent = byId.getIn([entry.entryId, 'content']);
            // it shouldn't reset the entry content
            if (!newEntry.get('content') && oldContent) {
                newEntry = newEntry.set('content', oldContent);
            }
            byId = byId.set(entry.entryId, newEntry);
        }
    });
    return state.set('byId', byId);
};

/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    // [searchTypes.QUERY_SUCCESS]: querySuccessHandler,

    // [searchTypes.MORE_QUERY_SUCCESS]: querySuccessHandler,

    // [searchTypes.RESET_RESULTS]: state =>
    //     state.merge({
    //         entries: state.get('entries').filter(entry => entry.get('type') !== 'searchEntry')
    //     }),

    // [appTypes.CLEAN_STORE]: () => initialState,

    // ************************* NEW REDUCERS ******************************

    [types.COMMENTS_GET_COUNT_SUCCESS]: (state, { data }) => {
        if (state.get('fullEntry') && (data.entryId === state.getIn(['fullEntry', 'entryId']))) {
            return state.setIn(['fullEntry', 'commentsCount'], data.count);
        }
        return state;
    },

    [types.ENTRY_CAN_CLAIM_SUCCESS]: (state, { data }) => {
        const canClaim = {};
        data.collection.forEach((res) => {
            canClaim[res.entryId] = res.canClaim;
        });
        return state.mergeIn(['canClaim'], new Map(canClaim));
    },

    [types.ENTRY_CLAIM]: (state, { entryId }) =>
        state.setIn(['flags', 'claimPending', entryId], true),

    [types.ENTRY_CLAIM_ERROR]: (state, { entryId }) =>
        state.setIn(['flags', 'claimPending', entryId], false),

    [types.ENTRY_CLAIM_SUCCESS]: (state, { data }) =>
        state.setIn(['flags', 'claimPending', data.entryId], false),

    [types.ENTRY_CLEAN_FULL]: state =>
        state.set('fullEntry', null),

    [types.ENTRY_DOWNVOTE]: (state, { entryId }) =>
        state.setIn(['flags', 'votePending', entryId], true),

    [types.ENTRY_DOWNVOTE_ERROR]: (state, { entryId }) =>
        state.setIn(['flags', 'votePending', entryId], false),

    [types.ENTRY_DOWNVOTE_SUCCESS]: (state, { data }) =>
        state.setIn(['flags', 'votePending', data.entryId], false),

    [types.ENTRY_GET_BALANCE_SUCCESS]: (state, { data }) => {
        const balance = {};
        data.collection.forEach((res) => {
            balance[res.entryId] = res.balance;
        });
        return state.mergeIn(['balance'], new Map(balance));
    },

    [types.ENTRY_GET_FULL]: state => state.setIn(['flags', 'fetchingFullEntry'], true),

    [types.ENTRY_GET_FULL_ERROR]: state => state.setIn(['flags', 'fetchingFullEntry'], false),

    [types.ENTRY_GET_FULL_SUCCESS]: (state, { data }) => {
        const fullEntry = state.get('fullEntry');
        const version = data.content && data.content.version;
        const latestVersion = fullEntry && data.entryId !== fullEntry.get('entryId') ?
            version || null :
            Math.max(state.get('fullEntryLatestVersion'), version) || null;

        return state.merge({
            flags: state.get('flags').set('fetchingFullEntry', false),
            fullEntry: getEntryRecord(data),
            fullEntryLatestVersion: latestVersion
        });
    },

    [types.ENTRY_GET_LATEST_VERSION_SUCCESS]: (state, { data = null }) =>
        state.set('fullEntryLatestVersion', data),

    [types.ENTRY_GET_SCORE_SUCCESS]: (state, { data }) => {
        const entry = state.getIn(['byId', data.entryId]);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('score', data.score) :
            oldFullEntry;
        return state.merge({
            byId: !entry ?
                state.get('byId') :
                state.get('byId').setIn([data.entryId, 'score'], data.score),
            fullEntry
        });
    },

    [types.ENTRY_GET_VOTE_OF_SUCCESS]: (state, { data }) => {
        const votes = {};
        data.collection.forEach((res) => {
            votes[res.entryId] = res.weight;
        });
        return state.mergeIn(['votes'], new Map(votes));
    },

    [types.ENTRY_IS_ACTIVE]: state =>
        state.setIn(['flags', 'isActivePending'], true),

    [types.ENTRY_IS_ACTIVE_ERROR]: state =>
        state.setIn(['flags', 'isActivePending'], false),

    [types.ENTRY_IS_ACTIVE_SUCCESS]: (state, { data }) => {
        const entry = state.getIn(['byId', data.entryId]);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('active', data.active) :
            oldFullEntry;
        return state.merge({
            byId: !entry ?
                state.get('byId') :
                state.get('byId').setIn([data.entryId, 'active'], data.active),
            flags: state.get('flags').set('isActivePending', false),
            fullEntry
        });
    },

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_PAGE_HIDE]: state => state.set('entryPageOverlay', new EntryPageOverlay()),

    [types.ENTRY_PAGE_SHOW]: (state, { entryId, version = null }) =>
        state.set('entryPageOverlay', new EntryPageOverlay({ entryId, version })),

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_RESOLVE_IPFS_HASH]: (state, { ipfsHash, columnId }) => {
        let newHashes = new Map();
        ipfsHash.forEach(hash => (newHashes = newHashes.set(hash, true)));
        return state.mergeIn(['flags', 'resolvingIpfsHash', columnId], newHashes);
    },

    [types.ENTRY_RESOLVE_IPFS_HASH_ERROR]: (state, { error, req }) =>
        state.setIn(['flags', 'resolvingIpfsHash', req.columnId, error.ipfsHash], false),

    [types.ENTRY_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data, req }) => {
        const index = req.ipfsHash.indexOf(data.ipfsHash);
        const entryId = req.entryIds[index];
        return state.merge({
            flags: state.get('flags').setIn(['resolvingIpfsHash', req.columnId, data.ipfsHash], false),
            byId: state.get('byId').setIn([entryId, 'content'], new EntryContent(data.entry))
        });
    },

    [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_UPVOTE]: (state, { entryId }) =>
        state.setIn(['flags', 'votePending', entryId], true),

    [types.ENTRY_UPVOTE_ERROR]: (state, { entryId }) =>
        state.setIn(['flags', 'votePending', entryId], false),

    [types.ENTRY_UPVOTE_SUCCESS]: (state, { data }) =>
        state.setIn(['flags', 'votePending', data.entryId], false),

    [types.ENTRY_VOTE_COST_SUCCESS]: (state, { data }) => {
        const voteCost = {};
        data.collection.forEach((res) => {
            voteCost[res.weight] = res.cost;
        });
        return state.set('voteCostByWeight', new Map(voteCost));
    }
});

export default entryState;
