import { delay } from 'redux-saga';
import { takeEvery, take, put, select, call, fork, all } from 'redux-saga/effects';
import * as pendingActionService from '../services/pending-actions-service';
import * as types from '../constants';
import * as actions from '../actions/app-actions';

const EXPIRATION_AMOUNT_OFFSET = 3000; // in ms
const NO_CONFIRM_ENTITIES = [
    'tag', 'tempProfile'
];

const PUBLISHER_PREFIX = '@@publisher/';

const publishTriggerActions = [
    ...Object.keys(types)
        .filter(type => type.includes('PUBLISH'))
];

// const fetchTriggerActions = [
//     types.GET_PUBLISHING_COMMENTS
// ];

// function* checkLogin () {
//     const loggedProfile = yield select(state => state.profileState.get('loggedProfile'));
//     return Date.parse(loggedProfile.get('expiration')) + EXPIRATION_AMOUNT_OFFSET > Date.now();
// }

// // first check if publishing entities must be confirmed or are confirmed;
// function* resumePublishing (action) {
//     const { data } = action;
//     const mustConfirm = !NO_CONFIRM_ENTITIES.includes(data.entityType);
//     if (mustConfirm && !data.confirmed) {
//         return yield put({
//             type: `${PUBLISHER_PREFIX}${action.type}_CONFIRM`,
//             data
//         });
//     }
//     const isLoggedIn = yield checkLogin();
//     if (!isLoggedIn) {
//         return yield put({ type: `${PUBLISHER_PREFIX}${types.SHOW_AUTH_DIALOG}`, data });
//     }
//     if (data && !data.publishing) {
//         data.publishing = true;
//         return yield put({
//             type: `${PUBLISHER_PREFIX}PUBLISH_${data.entityType.toUpperCase()}_START`,
//             data
//         });
//     }
// }

// function publishIncludes (type, pattern, startPos = 0) {
//     return type.includes(PUBLISHER_PREFIX) && type.includes(pattern, startPos);
// }

// // publish trigger actions must have pattern like `PUBLISH_{RESOURCE}[_ACTIONTYPE]`
// // example `PUBLISH_COMMENT`, `PUBLISH_CONFIRM_SUCCESS`,
// // `PUBLISH_COMMENT_LOGIN_SUCCESS`, etc.
// function filterPublishActions (action) {
//     const { type } = action;
//     const confirmSuccess = publishIncludes(type, '_CONFIRM_SUCCESS', (0 - type.length));
//     const loginSuccess = publishIncludes(type, 'LOGIN_SUCCESS', (0 - type.length));
//     return publishTriggerActions.includes(type) ||
//         confirmSuccess || loginSuccess;
// }

// function filterFetchActions (action) {
//     const { type } = action;
//     return fetchTriggerActions.includes(type);
// }

// function filterConfirmationActions ({ type }) {
//     const confirm = publishIncludes(type, '_CONFIRM', (0 - type.length));
//     const confirmSuccess = publishIncludes(type, '_CONFIRM_SUCCESS', (0 - type.length));
//     return confirm && !confirmSuccess;
// }

// function filterPublishingStartActions ({ type }) {
//     const startAction = publishIncludes(type, '_START', (0 - type.length));
//     return startAction;
// }

// function* startPublishing ({ type, data }) {
//     const publishPrefix = `@@${data.entityType}/`;
//     console.log('publish resource with prefix', publishPrefix);
//     yield call(delay, 2000);
//     yield put({ type: `${publishPrefix}PUBLISH_START`, data });
// }

// // listen for specific actionTypes;
// function* watchPublishingTriggers () {
//     yield all([
//         takeEvery(filterPublishActions, resumePublishing),
//         takeEvery(filterFetchActions, resumePublishing)
//     ]);
// }

// function* watchPublishingStartActions () {
//     yield all([
//         takeEvery(filterPublishingStartActions, startPublishing)
//     ]);
// }
// /** SIMS */
// function filterAuthActions (action) {
//     const { type } = action;
//     // const login = publishIncludes(type, 'LOGIN_SUCCESS');
//     const authDialog = publishIncludes(type, 'SHOW_AUTH_DIALOG');
//     return authDialog;
// }
// function* confirmPublishing (action) {
//     console.log('show confirmation dialog for', action);
//     const { type, data } = action;
//     data.confirmed = true;
//     console.log('simulate a confirmation action for 2 seconds');
//     yield call(delay, 2000);
//     console.log('launch confirm success action');
//     yield put({
//         type: `${PUBLISHER_PREFIX}PUBLISH_${data.entityType.toUpperCase()}_CONFIRM_SUCCESS`,
//         data
//     });
// }

// function* confirmAuth (action) {
//     console.log('show auth dialog for', action);
//     yield put({
//         type: types.PROFILE_LOGIN_SUCCESS,
//         data: action.data
//     });

//     console.log('simulate auth dialog open and submit for 2 seconds');

//     yield call(delay, 2000);

//     console.log('launch login success action');

//     yield put({
//         type: `${PUBLISHER_PREFIX}${types.PROFILE_LOGIN_SUCCESS}`,
//         data: action.data
//     });
// }

// function* watchConfirmActions () {
//     yield takeEvery(filterConfirmationActions, confirmPublishing);
// }

// function* watchAuthActions () {
//     yield takeEvery(filterAuthActions, confirmAuth);
// }
// /** /SIMS */
// function filterCommentPublishing ({ type }) {
//     return type.includes('@@comment/');
// }
// function* publishComments({ type, data }) {
//     console.log('get comment from state', data);
// }
// function* watchCommentPublishActions () {
//     const action = takeEvery(filterCommentPublishing, publishComments);
// }

/**
 * Save pending action in db
 * @param {Record} pendingAction Pending action meta info
 * @param {Record} payload Pending action payload -> the actual entity
 */
function* pendingActionSave ({ akashaId, pendingAction, payload }) {
    const { entityType, entityId } = pendingAction;
    console.log(entityType, 'the entity that must be saved', payload);
    try {
        yield pendingActionService.savePendingAction(
            akashaId,
            pendingAction.toJS(),
            payload.toJS()
        );
        yield put(actions.pendingActionSaveSuccess(entityId));
    } catch (ex) {
        console.log(ex, 'an exception occured');
    }
}

export function* watchPublishActions () {
    yield takeEvery(types.PENDING_ACTION_SAVE, pendingActionSave);
    // yield fork(watchPublishingTriggers);
    // yield fork(watchPublishingStartActions);
    // yield fork(watchCommentPublishActions);
    /** ***************** SIMULATIONS **************** */
    // yield fork(watchConfirmActions);
    // yield fork(watchAuthActions);
    /** ***************** /SIMULATIONS **************** */
}
