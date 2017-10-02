import { apply, call, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { actionChannels, enableChannel } from './helpers';
import * as actionActions from '../actions/action-actions';
import * as appActions from '../actions/app-actions';
import * as actions from '../actions/profile-actions';
import * as types from '../constants';
import * as profileService from '../services/profile-service';
import { selectBaseUrl, selectLastFollower, selectLastFollowing, selectLoggedAkashaId,
    selectNeedAuthAction, selectToken } from '../selectors';
import * as actionStatus from '../../constants/action-status';

const Channel = global.Channel;
const FOLLOWERS_ITERATOR_LIMIT = 13;
const FOLLOWINGS_ITERATOR_LIMIT = 13;

function* profileCreateEthAddress ({ data }) {
    const channel = Channel.server.auth.generateEthKey;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{ password: data }]);
}

function* profileDeleteLogged () {
    try {
        yield apply(profileService, profileService.profileDeleteLogged);
        yield put(actions.profileDeleteLoggedSuccess());
    } catch (error) {
        yield put(actions.profileDeleteLoggedError());
    }
}

function* profileFollow ({ actionId, akashaId }) {
    const channel = Channel.server.profile.followProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, akashaId }]);
}

function* profileFollowSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'followProfileSuccess',
        values: { akashaId: data.akashaId },
    }));
}

function* profileFollowersIterator ({ akashaId }) {
    const channel = Channel.server.profile.followersIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWERS_ITERATOR_LIMIT }]);
}

function* profileFollowingsIterator ({ akashaId }) {
    const channel = Channel.server.profile.followingIterator;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWINGS_ITERATOR_LIMIT }]);
}

function* profileGetBalance ({ unit = 'ether' }) {
    const channel = Channel.server.profile.getBalance;
    const account = yield select(state => state.profileState.getIn(['loggedProfile', 'account']));
    if (!account) {
        return;
    }
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ etherBase: account, unit }]);
}

function* profileGetData ({ akashaId, full = false }) {
    const channel = Channel.server.profile.getProfileData;
    yield apply(channel, channel.send, [{ akashaId, full }]);
    yield put(actions.profileIsFollower([akashaId])); // eslint-disable-line no-use-before-define
    yield fork(profileSaveAkashaIds, [akashaId]); // eslint-disable-line    
}

function* profileGetList ({ profileAddresses }) {
    const channel = Channel.server.profile.getProfileList;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [profileAddresses]);
}

function* profileGetLocal () {
    const channel = Channel.server.auth.getLocalIdentities;
    yield call(enableChannel, channel, Channel.client.auth.manager);
    yield apply(channel, channel.send, [{}]);
}

export function* profileGetLogged () {
    try {
        const loggedProfile = yield select(state => state.profileState.get('loggedProfile'));
        if (loggedProfile.get('account')) {
            return;
        }
        const profile = yield apply(profileService, profileService.profileGetLogged);
        yield put(actions.profileGetLoggedSuccess(profile));
        yield put(actions.profileGetBalance());
        if (profile && profile.profile) {
            yield call(profileGetData, { akashaId: profile.akashaId, full: true });
        }
    } catch (error) {
        yield put(actions.profileGetLoggedError(error));
    }
}

function* profileIsFollower ({ followings, akashaId }) {
    const channel = Channel.server.profile.isFollower;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    if (!akashaId) {
        akashaId = yield select(selectLoggedAkashaId);
    }
    const payload = followings.map(following => ({ akashaId, following }));
    yield apply(channel, channel.send, [payload]);
}

function* profileLogin ({ data }) {
    yield fork(watchProfileLoginChannel); // eslint-disable-line no-use-before-define
    const { ...payload } = data;
    const channel = Channel.server.auth.login;
    payload.password = new global.TextEncoder('utf-8').encode(payload.password);
    yield apply(channel, channel.send, [payload]);
}

function* profileLogout () {
    const channel = Channel.server.auth.logout;
    yield apply(channel, channel.send, [{}]);
}

function* profileMoreFollowersIterator ({ akashaId }) {
    const channel = Channel.server.profile.followersIterator;
    const start = yield select(state => selectLastFollower(state, akashaId));
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWERS_ITERATOR_LIMIT, start }]);
}

function* profileMoreFollowingsIterator ({ akashaId }) {
    const channel = Channel.server.profile.followingIterator;
    const start = yield select(state => selectLastFollowing(state, akashaId));
    yield apply(channel, channel.send, [{ akashaId, limit: FOLLOWINGS_ITERATOR_LIMIT, start }]);
}

function* profileResolveIpfsHash ({ ipfsHash, columnId, akashaIds }) {
    const channel = Channel.server.profile.resolveProfileIpfsHash;
    // save the akashaIds in the local db for quick suggestions
    yield fork(profileSaveAkashaIds, akashaIds); // eslint-disable-line no-use-before-define
    yield call(enableChannel, channel, Channel.client.profile.manager);
    yield apply(channel, channel.send, [{ ipfsHash, columnId, akashaIds }]);
}

export function* profileSaveAkashaIds (akashaIds) {
    try {
        yield apply(profileService, profileService.profileSaveAkashaIds, [akashaIds]);
    } catch (error) {
        yield put(actions.profileSaveAkashaIdsError(error));
    }
}

function* profileSaveLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileSaveLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileSaveLoggedError(error));
    }
}

function* profileSendTip ({ actionId, akashaId, receiver, value }) {
    const channel = Channel.server.profile.tip;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{
        token,
        actionId,
        akashaId,
        receiver,
        value
    }]);
}

function* profileSendTipSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'sendTipSuccess',
        values: { akashaId: data.akashaId },
    }));
}

function* profileUnfollow ({ actionId, akashaId }) {
    const channel = Channel.server.profile.unFollowProfile;
    yield call(enableChannel, channel, Channel.client.profile.manager);
    const token = yield select(selectToken);
    yield apply(channel, channel.send, [{ token, actionId, akashaId }]);
}

function* profileUnfollowSuccess ({ data }) {
    yield put(appActions.showNotification({
        id: 'unfollowProfileSuccess',
        values: { akashaId: data.akashaId },
    }));
}

function* profileUpdateLogged (loggedProfile) {
    try {
        yield apply(profileService, profileService.profileUpdateLogged, [loggedProfile]);
    } catch (error) {
        yield put(actions.profileUpdateLoggedError(error));
    }
}

// Channel watchers

function* watchProfileCreateEthAddressChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.generateEthKey);
        if (resp.error) {
            yield put(actions.profileCreateEthAddressError(resp.error));
        } else {
            yield put(actions.profileCreateEthAddressSuccess(resp.data));
            const account = resp.data.address;
            const { password } = resp.request;
            yield put(actions.profileLogin({ account, password }));
        }
    }
}

function* watchProfileFollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followProfile);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.profileFollowError(resp.error, resp.request));
            yield put(actionActions.actionDelete(actionId));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

function* watchProfileFollowersIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followersIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.profileMoreFollowersIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowersIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.start) {
            yield put(actions.profileMoreFollowersIteratorSuccess(resp.data));
        } else {
            yield put(actions.profileFollowersIteratorSuccess(resp.data));
        }
    }
}

function* watchProfileFollowingsIteratorChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.followingIterator);
        if (resp.error) {
            if (resp.request.start) {
                yield put(actions.profileMoreFollowingsIteratorError(resp.error, resp.request));
            } else {
                yield put(actions.profileFollowingsIteratorError(resp.error, resp.request));
            }
        } else if (resp.request.start) {
            yield put(actions.profileMoreFollowingsIteratorSuccess(resp.data));
        } else {
            yield put(actions.profileFollowingsIteratorSuccess(resp.data));
        }
    }
}

function* watchProfileGetBalanceChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getBalance);
        if (resp.error) {
            yield put(actions.profileGetBalanceError(resp.error));
        } else {
            yield put(actions.profileGetBalanceSuccess(resp.data));
        }
    }
}

function* watchProfileGetDataChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getProfileData);
        if (resp.error) {
            yield put(actions.profileGetDataError(resp.error));
        } else {
            yield put(actions.profileGetDataSuccess(resp.data));
        }
    }
}

function* watchProfileGetLocalChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.getLocalIdentities);
        if (resp.error) {
            yield put(actions.profileGetLocalError(resp.error));
        } else {
            const profileAddresses = [];
            resp.data.forEach((data) => {
                if (data.profile) {
                    profileAddresses.push({ profile: data.profile });
                }
            });
            yield put(actions.profileGetList(profileAddresses));
            yield put(actions.profileGetLocalSuccess(resp.data));
        }
    }
}

function* watchProfileGetListChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.getProfileList);
        if (resp.error) {
            yield put(actions.profileGetListError(resp.error));
        } else {
            yield put(actions.profileGetListSuccess(resp.data));
        }
    }
}

function* watchProfileIsFollowerChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.isFollower);
        if (resp.error) {
            yield put(actions.profileIsFollowerError(resp.error, resp.request));
        } else {
            yield put(actions.profileIsFollowerSuccess(resp.data));
        }
    }
}

function* watchProfileLoginChannel () {
    const resp = yield take(actionChannels.auth.login);
    if (resp.error) {
        yield put(actions.profileLoginError(resp.error));
    } else if (resp.request.account === resp.data.account) {
        const { akashaId, profile, reauthenticate } = resp.request;
        if (akashaId && profile) {
            resp.data.akashaId = akashaId;
            resp.data.profile = profile;
            yield call(profileGetData, { akashaId, reauthenticate: true });
        }
        if (reauthenticate) {
            const needAuthAction = yield select(selectNeedAuthAction);
            yield call(profileUpdateLogged, resp.data);
            if (needAuthAction) {
                yield put(actionActions.actionPublish(needAuthAction.get('id')));
            }
        } else {
            yield call(profileSaveLogged, resp.data);
        }
        yield put(actions.profileLoginSuccess(resp.data));
        yield put(actions.profileGetBalance());
    }
}

function* watchProfileLogoutChannel () {
    while (true) {
        const resp = yield take(actionChannels.auth.logout);
        if (resp.error) {
            yield put(actions.profileLogoutError(resp.error));
        } else {
            yield call(profileDeleteLogged);
            yield put(actions.profileLogoutSuccess());
        }
    }
}

function* watchProfileResolveIpfsHashChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.resolveProfileIpfsHash);
        if (resp.error) {
            yield put(actions.profileResolveIpfsHashError(resp.error, resp.request));
        } else if (resp.data.profile) {
            const baseUrl = yield select(selectBaseUrl);
            if (resp.data.profile.avatar) {
                resp.data.profile.avatar = `${baseUrl}/${resp.data.profile.avatar}`;
            }
            yield put(actions.profileResolveIpfsHashSuccess(resp.data, resp.request));
        }
    }
}

function* watchProfileSendTipChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.tip);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.profileSendTipError(resp.error, resp.request));
            yield put(actionActions.actionDelete(actionId));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

function* watchProfileUnfollowChannel () {
    while (true) {
        const resp = yield take(actionChannels.profile.unFollowProfile);
        const { actionId } = resp.request;
        if (resp.error) {
            yield put(actions.profileUnfollowError(resp.error, resp.request));
            yield put(actionActions.actionDelete(actionId));
        } else {
            const changes = { id: actionId, status: actionStatus.publishing, tx: resp.data.tx };
            yield put(actionActions.actionUpdate(changes));
        }
    }
}

export function* registerProfileListeners () {
    yield fork(watchProfileCreateEthAddressChannel);
    yield fork(watchProfileFollowChannel);
    yield fork(watchProfileFollowersIteratorChannel);
    yield fork(watchProfileFollowingsIteratorChannel);
    yield fork(watchProfileGetBalanceChannel);
    yield fork(watchProfileGetDataChannel);
    yield fork(watchProfileGetLocalChannel);
    yield fork(watchProfileGetListChannel);
    yield fork(watchProfileIsFollowerChannel);
    yield fork(watchProfileLogoutChannel);
    yield fork(watchProfileResolveIpfsHashChannel);
    yield fork(watchProfileSendTipChannel);
    yield fork(watchProfileUnfollowChannel);
}

export function* watchProfileActions () { // eslint-disable-line max-statements
    yield takeLatest(types.PROFILE_CREATE_ETH_ADDRESS, profileCreateEthAddress);
    yield takeLatest(types.PROFILE_DELETE_LOGGED, profileDeleteLogged);
    yield takeEvery(types.PROFILE_FOLLOW, profileFollow);
    yield takeEvery(types.PROFILE_FOLLOW_SUCCESS, profileFollowSuccess);
    yield takeEvery(types.PROFILE_FOLLOWERS_ITERATOR, profileFollowersIterator);
    yield takeEvery(types.PROFILE_FOLLOWINGS_ITERATOR, profileFollowingsIterator);
    yield takeLatest(types.PROFILE_GET_BALANCE, profileGetBalance);
    yield takeEvery(types.PROFILE_GET_DATA, profileGetData);
    yield takeLatest(types.PROFILE_GET_LIST, profileGetList);
    yield takeLatest(types.PROFILE_GET_LOCAL, profileGetLocal);
    yield takeLatest(types.PROFILE_GET_LOGGED, profileGetLogged);
    yield takeEvery(types.PROFILE_IS_FOLLOWER, profileIsFollower);
    yield takeLatest(types.PROFILE_LOGIN, profileLogin);
    yield takeLatest(types.PROFILE_LOGOUT, profileLogout);
    yield takeEvery(types.PROFILE_MORE_FOLLOWERS_ITERATOR, profileMoreFollowersIterator);
    yield takeEvery(types.PROFILE_FOLLOWINGS_ITERATOR, profileMoreFollowingsIterator);
    yield takeEvery(types.PROFILE_RESOLVE_IPFS_HASH, profileResolveIpfsHash);
    yield takeEvery(types.PROFILE_SEND_TIP, profileSendTip);
    yield takeEvery(types.PROFILE_SEND_TIP_SUCCESS, profileSendTipSuccess);
    yield takeEvery(types.PROFILE_UNFOLLOW, profileUnfollow);
    yield takeEvery(types.PROFILE_UNFOLLOW_SUCCESS, profileUnfollowSuccess);
}

export function* registerWatchers () {
    yield fork(registerProfileListeners);
    yield fork(watchProfileActions);
}
