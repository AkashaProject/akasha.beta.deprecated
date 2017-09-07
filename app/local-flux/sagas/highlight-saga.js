import { apply, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/highlight-actions';
import * as types from '../constants';
import * as highlightService from '../services/highlight-service';
import { selectLoggedAccount } from '../selectors';

function* highlightDelete ({ id }) {
    try {
        yield apply(highlightService, highlightService.deleteHighlight, [id]);
        yield put(actions.highlightDeleteSuccess(id));
    } catch (error) {
        yield put(actions.highlightDeleteError(error));
    }
}

function* highlightEditNotes ({ type, ...payload }) {
    try {
        const highlight = yield apply(highlightService, highlightService.editNotes, [payload]);
        yield put(actions.highlightEditNotesSuccess(highlight));
    } catch (error) {
        yield put(actions.highlightEditNotesError(error));
    }
}

export function* highlightGetAll () {
    try {
        const account = yield select(selectLoggedAccount);
        const data = yield apply(highlightService, highlightService.getAll, [account]);
        yield put(actions.highlightGetAllSuccess(data));
    } catch (error) {
        yield put(actions.highlightGetAllError(error));
    }
}

function* highlightSave ({ payload }) {
    try {
        const account = yield select(selectLoggedAccount);
        const highlight = yield apply(
            highlightService,
            highlightService.saveHighlight,
            [{ account, ...payload }]
        );
        yield put(actions.highlightSaveSuccess(highlight));
    } catch (error) {
        yield put(actions.highlightSaveError(error));
    }
}

function* highlightSearch ({ search }) {
    try {
        const account = yield select(selectLoggedAccount);
        search = search.toLowerCase();
        const data = yield apply(highlightService, highlightService.searchHighlight, [{ account, search }]);
        yield put(actions.highlightSearchSuccess(data));
    } catch (error) {
        yield put(actions.highlightSearchError(error));
    }
}

export function* watchHighlightActions () {
    yield takeEvery(types.HIGHLIGHT_DELETE, highlightDelete);
    yield takeEvery(types.HIGHLIGHT_EDIT_NOTES, highlightEditNotes);
    yield takeEvery(types.HIGHLIGHT_SAVE, highlightSave);
    yield takeEvery(types.HIGHLIGHT_SEARCH, highlightSearch);
}