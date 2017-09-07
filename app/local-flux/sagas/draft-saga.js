import { call, put, select, takeEvery, takeLatest, throttle } from 'redux-saga/effects';
import { DraftJS, editorStateToJSON, editorStateFromRaw } from 'megadraft';
import { Map, Record } from 'immutable';
import { DraftModel } from '../reducers/models';
import * as types from '../constants';
import * as draftService from '../services/draft-service';
import * as draftActions from '../actions/draft-actions';

const { EditorState, SelectionState } = DraftJS;
/**
 * Draft saga
 */

/**
 * create a new draft in state
 * the trick is to split selectionState from editorState
 * and to keep them synced
 */
function* draftCreate ({ data }) {
    const newEditorState = EditorState.createEmpty();
    const firstKey = newEditorState.getCurrentContent().getFirstBlock().getKey();
    const newSelectionState = SelectionState.createEmpty(firstKey);
    /**
     * create a new editor state with the selection applied
     */
    const editorState = EditorState.acceptSelection(newEditorState, newSelectionState);
    yield put(draftActions.draftCreateSuccess({
        content: {
            draft: editorState,
            title: '',
            excerpt: '',
        },
        selectionState: newSelectionState,
        ...data
    }));
}

/**
 * get all drafts.
 */
function* draftsGet ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftsGet], data.akashaId);
        let drafts = new Map();
        if (response.length > 0) {
            response.forEach((draft) => {
                draft.content.draft = editorStateFromRaw(draft.content.draft);
                drafts = drafts.setIn([draft.id], DraftModel.createDraft(draft));
            });
        }
        yield put(draftActions.draftsGetSuccess({ drafts }));
    } catch (ex) {
        console.error(ex);
        yield put(draftActions.draftsGetError({ error: ex }));
    }
}
/**
 * get draft by id
 */
function* draftGetById ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftGetById], data.draftId);
        yield put(draftActions.draftGetByIdSuccess({ draft: response }));
    } catch (ex) {
        yield put(draftActions.draftGetByIdError({ error: ex }));
    }
}
/**
 * save draft to db every x seconds
 */
function* draftAutoSave ({ data }) {
    // console.log('autosaving draft...', data);
    yield put(draftActions.draftAutosave(data.draft));
    /**
     * prepare data to save in db
     */
    const dataToSave = Object.assign({}, data.draft.toJS());
    const jsonDraft = JSON.parse(editorStateToJSON(data.draft.content.draft));
    dataToSave.content = data.draft.content.toJS();
    dataToSave.content.draft = jsonDraft;
    dataToSave.tags = data.draft.tags.toJS();

    try {
        const response = yield call([draftService, draftService.draftCreateOrUpdate], { draft: dataToSave });
        yield put(draftActions.draftAutosaveSuccess(response));
    } catch (ex) {
        console.error(ex, 'exception thrown');
        yield put(draftActions.draftAutosaveError({ error: ex }));
    }
}

function* draftUpdate ({ data }) {
    const draftObj = data;
    const draft = data.content.get('draft');
    const selectionState = draft.getSelection();
    yield put(draftActions.draftUpdateSuccess({
        draft: draftObj,
        selectionState
    }));
}

function* draftsGetCount ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftsGetCount], { akashaId: data.akashaId });
        yield put(draftActions.draftsGetCountSuccess({ count: response }));
    } catch (ex) {
        yield put(draftActions.draftsGetCountError({ error: ex }));
    }
}

function* draftDelete ({ data }) {
    try {
        const response = yield call([draftService, draftService.draftDelete], { draftId: data.draftId });
        yield put(draftActions.draftDeleteSuccess({ draftId: response }));
    } catch (ex) {
        yield put(draftActions.draftDeleteError({ error: ex, draftId: data.draftId }));
    }
}

export function* watchDraftActions () {
    yield takeEvery(types.DRAFT_CREATE, draftCreate);
    yield takeEvery(types.DRAFT_GET_BY_ID, draftGetById);
    yield takeEvery(types.DRAFT_UPDATE, draftUpdate);
    yield throttle(2000, types.DRAFT_UPDATE_SUCCESS, draftAutoSave);
    yield takeLatest(types.DRAFTS_GET, draftsGet);
    yield takeLatest(types.DRAFTS_GET_COUNT, draftsGetCount);
    yield takeEvery(types.DRAFT_DELETE, draftDelete);
}
