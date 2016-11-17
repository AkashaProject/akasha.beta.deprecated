import { EntryService } from '../services';
import { entryActionCreators } from './action-creators';

let entryActions = null;

class EntryActions {

    constructor (dispatch) {
        if (!entryActions) {
            entryActions = this;
        }
        this.dispatch = dispatch;
        this.entryService = new EntryService();
        return entryActions;
    }

    getEntriesCount = (akashaId) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().entryState.get('flags');
            if (!flags.get('fetchingEntriesCount')) {
                dispatch(entryActionCreators.getEntriesCount({
                    fetchingEntriesCount: true
                }));
                this.entryService.getEntriesCount({
                    akashaId,
                    onSuccess: result =>
                        dispatch(entryActionCreators.getEntriesCountSuccess(result, {
                            fetchingEntriesCount: false,
                            entriesCountFetched: true
                        })),
                    onError: reason => dispatch(entryActionCreators.getEntriesCountError(reason, {
                        fetchingEntriesCount: false,
                        entriesCountFetched: true
                    }))
                });
            }
        });
    };

    getTags = (startingIndex = 0) => {
        this.dispatch(entryActionCreators.getTags());
        return this.entryService.getTags(startingIndex).then(result =>
            this.dispatch(entryActionCreators.getTagsSuccess(result))
        ).catch(reason => this.dispatch(entryActionCreators.getTagsError(reason)));
    };

    checkTagExistence = (tag) => {
        this.dispatch(entryActionCreators.checkTagExistence());
        return this.entryService.checkTagExistence(tag).then(result =>
            this.dispatch(entryActionCreators.checkTagExistenceSuccess(result))
        ).catch(reason => this.dispatch(entryActionCreators.checkTagExistenceError(reason)));
    };

    createTag = (tag) => {
        this.dispatch(entryActionCreators.createTag());
        return this.entryService.createTag(tag).then(result =>
            this.dispatch(entryActionCreators.createTagSuccess(result.tag))
        ).catch(reason => this.dispatch(entryActionCreators.createTagError(reason)));
    };

    requestAuthentication = () => {

    };
    getSortedEntries = ({ sortBy }) => {
        this.entryService.getSortedEntries({ sortBy }).then(result =>
            this.dispatch(entryActionCreators.getSortedEntries(result))
        );
    };
    createSavedEntry = (akashaId, entry) => {
        this.entryService.createSavedEntry(akashaId, entry).then(savedEntry =>
            this.dispatch(entryActionCreators.createSavedEntrySuccess(savedEntry))
        ).catch(reason => this.dispatch(entryActionCreators.createSavedEntryError(reason)));
    };
    getSavedEntries = akashaId =>
        this.entryService.getSavedEntries(akashaId).then(entries =>
            this.dispatch(entryActionCreators.getSavedEntriesSuccess(entries))
        ).catch(reason => this.dispatch(entryActionCreators.getSavedEntriesError(reason))
        );

    getProfileEntries = (akashaId, startId, limit = 5) =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().entryState.get('flags');
            if (!flags.get('profileEntriesFetched') || !flags.get('fetchingProfileEntries')) {
                dispatch(entryActionCreators.getProfileEntries({
                    fetchingEntriesCount: true
                }));
                this.entryService.getProfileEntries({
                    akashaId,
                    startId,
                    limit,
                    onSuccess: data =>
                        dispatch(entryActionCreators.getProfileEntriesSuccess(data, {
                            profileEntriesFetched: true
                        })),
                    onError: error =>
                        dispatch(entryActionCreators.getProfileEntriesError(error, {
                            fetchingEntriesCount: false,
                            profileEntriesFetched: true
                        }))
                });
            }
        });

    getEntriesForTag = ({ tagName }) => {
        this.entryService.getEntriesForTag({ tagName });
    };
    castUpvote = (entryAddress, voteWeight) => {
        this.entryService.castUpvote(entryAddress, voteWeight).then((result) => {
            if (result.error) {
                return this.dispatch(entryActionCreators.castUpvoteError(result.error));
            }
            return this.dispatch(entryActionCreators.castUpvoteSuccess(result.data));
        });
    };
    castDownvote = (entryAddress, voteWeight) => {};
    getLicences = () => {
        this.entryService.getLicences({
            onSuccess: ({ licenses }) =>
                this.dispatch(entryActionCreators.getLicencesSuccess(licenses)),
            onError: error => this.dispatch(entryActionCreators.getLicencesError(error))
        });
    };
    getLicenceById = (id) => {
        this.EntryService.getLicenceById({
            id,
            onSuccess: ({ license }) =>
                this.dispatch(entryActionCreators.getLicenceByIdSuccess(license)),
            onError: error => this.dispatch(entryActionCreators.getLicenceByIdError(error))
        });
    };
}
export { EntryActions };
