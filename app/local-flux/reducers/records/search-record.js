import { Record, List, Map } from 'immutable';

export const SearchRecord = Record({
    consecutiveQueryErrors: 0,
    currentPage: null,
    entryIds: new List(),
    errors: new List(),
    flags: new Map(),
    profiles: new List(),
    query: '',
    resultsCount: 0,
    tagResultsCount: 0,
    searchService: null,
    showResults: false,
    tags: new List(),
    totalPages: null,
});
