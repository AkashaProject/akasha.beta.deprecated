import { call, fork, put } from 'redux-saga/effects';
import * as actions from '../actions/app-actions';
import { createActionChannels } from './helpers';
import { gethGetOptions, gethGetStatus, ipfsGetConfig, ipfsGetStatus, registerEProcListeners,
    watchEProcActions } from './external-process-saga';
import { registerProfileListeners, watchProfileActions } from './profile-saga';
import { getSettings, watchSettingsActions } from './settings-saga';
import { watchTempProfileActions } from './temp-profile-saga';
import { registerUtilsListeners, watchUtilsActions } from './utils-saga';

function* registerListeners () {
    yield fork(registerEProcListeners);
    yield fork(registerProfileListeners);
    yield fork(registerUtilsListeners);
}

function* launchActions () {
    const timestamp = new Date().getTime();
    yield put(actions.setTimestamp(timestamp));
    // from local db
    yield fork(getSettings);

    // from geth.options channel
    yield fork(gethGetOptions);
    // from ipfs.getConfig channel
    yield fork(ipfsGetConfig);

    yield fork(gethGetStatus);
    yield fork(ipfsGetStatus);
}

function* bootstrapApp () {
    // the appReady action will be dispatched after these actions will be called
    yield call(launchActions);
    yield put(actions.appReady());
}

export default function* rootSaga () {
    createActionChannels();
    yield fork(registerListeners);
    yield fork(bootstrapApp);
    yield fork(watchEProcActions);
    yield fork(watchProfileActions);
    yield fork(watchSettingsActions);
    yield fork(watchTempProfileActions);
    yield fork(watchUtilsActions);
}
