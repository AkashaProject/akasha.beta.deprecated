import { List, Map, Record } from 'immutable';

export const EntryAuthor = Record({
    akashaId: null,
    ethAddress: null,
});

export const EntryContent = Record({
    draft: {},
    excerpt: null,
    featuredImage: null,
    licence: {},
    tags: [],
    title: '',
    version: null,
    wordCount: null
});

export const EntryRecord = Record({
    author: new EntryAuthor(),
    baseUrl: '',
    commentsCount: 0,
    content: EntryContent(),
    endPeriod: null,
    entryId: null,
    publishDate: null,
    score: null,
    totalKarma: null,
    totalVotes: null
});

const Flags = Record({
    fetchingEntryBalance: false,
    fetchingFullEntry: false,
    isActivePending: false,
    pendingEntries: new Map(),
});

export const EntryPageOverlay = Record({
    entryId: null,
    version: null
});

export const EntryState = Record({
    balance: new Map(),
    byId: new Map(),
    canClaim: new Map(),
    published: new List(),
    flags: new Flags(),
    fetchingEntriesCount: false,
    entryPageOverlay: new EntryPageOverlay(),
    fullEntry: null,
    fullEntryLatestVersion: null,
    savedEntries: new List(),
    moreAllStreamEntries: false,
    moreProfileEntries: false,
    moreSavedEntries: false,
    moreSearchEntries: false,
    moreTagEntries: false,
    newestEntries: new List(),
    tagEntriesCount: new Map(),
    entriesCount: 0, // entries published by a logged profile
    voteCostByWeight: new Map(),
    votes: new Map(),
});
