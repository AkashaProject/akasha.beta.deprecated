import { AppActions, TransactionActions } from 'local-flux';
import { ProfileService, AuthService, RegistryService } from '../services';
import { profileActionCreators } from './action-creators';
import imageCreator from '../../utils/imageUtils';

let profileActions = null;

class ProfileActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (profileActions) {
            return profileActions;
        }
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        this.profileService = new ProfileService();
        this.authService = new AuthService();
        this.registryService = new RegistryService();
        this.dispatch = dispatch;
        profileActions = this;
    }

    login = ({ account, password, rememberTime, akashaId }) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            password = new TextEncoder('utf-8').encode(password);
            dispatch(profileActionCreators.login({
                loginRequested: true
            }));
            this.authService.login({
                account,
                password,
                rememberTime,
                akashaId,
                onSuccess: (data) => {
                    this.dispatch(profileActionCreators.loginSuccess(data, {
                        loginRequested: false
                    }));
                    this.getCurrentProfile();
                },
                onError: error => this.dispatch(profileActionCreators.loginError(error, {
                    loginRequested: false
                }))
            });
        });
    };

    logout = (profileKey, flush) => {
        this.authService.logout({
            options: {
                profileKey,
                flush
            },
            onSuccess: data => this.dispatch(profileActionCreators.logoutSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.logoutError(error))
        });
    };

    getLoggedProfile = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingLoggedProfile')) {
                dispatch(profileActionCreators.getLoggedProfile({
                    fetchingLoggedProfile: true
                }));
                this.authService.getLoggedProfile({
                    onSuccess: (data) => {
                        dispatch(profileActionCreators.getLoggedProfileSuccess(data, {
                            fetchingLoggedProfile: false
                        }));
                        this.getCurrentProfile();
                    },
                    onError: error => dispatch(profileActionCreators.getLoggedProfileError(error, {
                        fetchingLoggedProfile: false
                    }))
                });
            }
        });
    };

    getLocalProfiles = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingLocalProfiles')) {
                dispatch(profileActionCreators.getLocalProfiles({
                    fetchingLocalProfiles: true
                }));
                this.authService.getLocalIdentities({
                    onSuccess: (data) => {
                        this.dispatch(profileActionCreators.getLocalProfilesSuccess(data, {
                            fetchingLocalProfiles: false,
                            localProfilesFetched: true
                        }));
                    },
                    onError: err => this.dispatch(profileActionCreators.getLocalProfilesError(err, {
                        fetchingLocalProfiles: false,
                        localProfilesFetched: false
                    }))
                });
            }
        });
    };

    getCurrentProfile = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingCurrentProfile') && !flags.get('currentProfileFetched')) {
                dispatch(profileActionCreators.getCurrentProfile({
                    fetchingCurrentProfile: true
                }));
                this.registryService.getCurrentProfile({
                    onSuccess: data =>
                        dispatch(profileActionCreators.getCurrentProfileSuccess(data, {
                            fetchingCurrentProfile: false,
                            currentProfileFetched: true
                        })),
                    onError: err => dispatch(profileActionCreators.getCurrentProfileError(err, {
                        fetchingCurrentProfile: false
                    }))
                });
            }
        });
    };

    clearLocalProfiles = () =>
        this.dispatch(profileActionCreators.clearLocalProfilesSuccess());

    clearOtherProfiles = () =>
        this.dispatch(profileActionCreators.clearOtherProfiles());

    /**
     * profiles = [{key: string, profile: string}]
     */
    getProfileData = (profiles, full = false) => {
        this.dispatch(profileActionCreators.getProfileData({
            fetchingProfileData: true
        }));
        profiles.forEach((profileObject) => {
            this.profileService.getProfileData({
                options: {
                    profile: profileObject.profile,
                    full
                },
                onSuccess: (data) => {
                    if (data.avatar) {
                        data.avatar = imageCreator(data.avatar, data.baseUrl);
                    }
                    this.dispatch(profileActionCreators.getProfileDataSuccess(data, {
                        fetchingProfileData: false
                    }));
                },
                onError: (err) => {
                    this.dispatch(profileActionCreators.getProfileDataError(err, {
                        fetchingProfileData: false
                    }));
                }
            });
        });
    };

    updateProfileData = (updatedProfile, gas) => {
        const { firstName, lastName, avatar, about, links,
            backgroundImage } = updatedProfile.toJS();
        const ipfs = { firstName, lastName, about, avatar };

        if (links) {
            ipfs.links = links;
        }

        if (backgroundImage) {
            ipfs.backgroundImage = backgroundImage.length ? backgroundImage[0] : backgroundImage;
        }
        this.dispatch(profileActionCreators.updateProfileData({
            updatingProfile: true
        }));
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            this.profileService.updateProfileData({
                token: loggedProfile.get('token'),
                ipfs,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'updateProfile'
                    }]);
                    this.appActions.showNotification({
                        id: 'updatingProfile',
                        values: {},
                        duration: 3000
                    });
                },
                onError: error =>
                    dispatch(profileActionCreators.updateProfileDataError(error, {
                        updatingProfile: false
                    }))
            });
        });
    };

    getProfileList = (profiles) => {
        this.dispatch(profileActionCreators.getProfileList({
            fetchingProfileList: true
        }));
        this.profileService.getProfileList({
            profiles,
            onSuccess: (data) => {
                data.collection.forEach((item) => {
                    if (item.avatar) {
                        item.avatar = imageCreator(item.avatar, item.baseUrl);
                    }
                });
                this.dispatch(profileActionCreators.getProfileListSuccess(data, {
                    fetchingProfileList: false
                }));
            },
            onError: error =>
                this.dispatch(profileActionCreators.getProfileListError(error, {
                    fetchingProfileList: false
                }))
        });
    }

    updateProfileDataSuccess = () => {
        this.dispatch(profileActionCreators.updateProfileDataSuccess({
            updatingProfile: false
        }));
        this.appActions.showNotification({
            id: 'profileUpdateSuccess',
            values: { }
        });
    };

    getProfileBalance = unit =>
        this.dispatch((dispatch, getState) => {
            const profileKey = getState().profileState.getIn(['loggedProfile', 'account']);
            this.profileService.getProfileBalance({
                options: {
                    etherBase: profileKey,
                    unit
                },
                onSuccess: data =>
                    this.dispatch(profileActionCreators.getProfileBalanceSuccess(data)),
                onError: error =>
                    this.dispatch(profileActionCreators.getProfileBalanceError(error))
            });
        });

    clearLoggedProfile = () => {
        this.authService.deleteLoggedProfile({
            onSuccess: () => this.dispatch(profileActionCreators.deleteLoggedProfileSuccess()),
            onError: error => this.dispatch(profileActionCreators.deleteLoggedProfileError(error))
        });
    };

    clearErrors = () => {
        this.dispatch(profileActionCreators.clearErrors());
    };
    clearLoginErrors = () => {
        this.dispatch(profileActionCreators.clearLoginErrors());
    };
    resetFlags = () => {
        this.dispatch(profileActionCreators.resetFlags());
    };
    // this method is only called to check if there is a logged profile
    // it does not dispatch anything and is useless as an action
    //
    checkLoggedProfile = (cb) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            if (loggedProfile.get('account')) {
                return cb(null, true);
            }
            return this.authService.getLoggedProfile({
                onSuccess: (data) => {
                    if (data && data.account !== '') {
                        return cb(null, true);
                    }
                    return cb(null, false);
                },
                onError: err => cb(err, false)
            });
        });
    };

    hideNotification = notification =>
        this.dispatch(profileActionCreators.hideNotification(notification));

    getFollowersCount = (akashaId) => {
        this.dispatch(profileActionCreators.getFollowersCount());
        this.profileService.getFollowersCount({
            akashaId,
            onError: error =>
                this.dispatch(profileActionCreators.getFollowersCountError(error)),
            onSuccess: data =>
                this.dispatch(
                    profileActionCreators.getFollowersCountSuccess(data.akashaId, data.count)
                )
        });
    };

    getFollowingCount = (akashaId) => {
        this.dispatch(profileActionCreators.getFollowingCount());
        this.profileService.getFollowingCount({
            akashaId,
            onError: error =>
                this.dispatch(profileActionCreators.getFollowingCountError(error)),
            onSuccess: data =>
                this.dispatch(
                    profileActionCreators.getFollowingCountSuccess(data.akashaId, data.count)
                )
        });
    };

    followersIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.followersIterator({
            fetchingFollowers: true
        }));
        this.profileService.followersIterator({
            akashaId,
            start,
            limit,
            onError: error =>
                this.dispatch(profileActionCreators.followersIteratorError(error, {
                    fetchingFollowers: false
                })),
            onSuccess: (data) => {
                const akashaIds = [];
                data.collection.forEach((item) => {
                    akashaIds.push({ akashaId: item.profile.akashaId });
                    if (item.profile.avatar) {
                        item.profile.avatar =
                            imageCreator(item.profile.avatar, item.profile.baseUrl);
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(profileActionCreators.followersIteratorSuccess(data, {
                    fetchingFollowers: false
                }));
            }
        });
    };

    moreFollowersIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.moreFollowersIterator({
            fetchingMoreFollowers: true
        }));
        this.profileService.moreFollowersIterator({
            akashaId,
            start,
            limit,
            onError: error =>
                this.dispatch(profileActionCreators.moreFollowersIteratorError(error, {
                    fetchingMoreFollowers: false
                })),
            onSuccess: (data) => {
                const akashaIds = [];
                data.collection.forEach((item) => {
                    akashaIds.push({ akashaId: item.profile.akashaId });
                    if (item.profile.avatar) {
                        item.profile.avatar =
                            imageCreator(item.profile.avatar, item.profile.baseUrl);
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(profileActionCreators.moreFollowersIteratorSuccess(data, {
                    fetchingMoreFollowers: false
                }));
            }
        });
    };

    followingIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.followingIterator({
            fetchingFollowing: true
        }));
        this.profileService.followingIterator({
            akashaId,
            start,
            limit,
            onError: error =>
                this.dispatch(profileActionCreators.followingIteratorError(error, {
                    fetchingFollowing: false
                })),
            onSuccess: (data) => {
                const akashaIds = [];
                data.collection.forEach((item) => {
                    akashaIds.push({ akashaId: item.profile.akashaId });
                    if (item.profile.avatar) {
                        item.profile.avatar =
                            imageCreator(item.profile.avatar, item.profile.baseUrl);
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(profileActionCreators.followingIteratorSuccess(data, {
                    fetchingFollowing: false
                }));
            }
        });
    };

    moreFollowingIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.moreFollowingIterator({
            fetchingMoreFollowing: true
        }));
        this.profileService.moreFollowingIterator({
            akashaId,
            start,
            limit,
            onError: error =>
                this.dispatch(profileActionCreators.moreFollowingIteratorError(error, {
                    fetchingMoreFollowing: false
                })),
            onSuccess: (data) => {
                const akashaIds = [];
                data.collection.forEach((item) => {
                    akashaIds.push({ akashaId: item.profile.akashaId });
                    if (item.profile.avatar) {
                        item.profile.avatar =
                            imageCreator(item.profile.avatar, item.profile.baseUrl);
                    }
                });
                this.profileService.saveAkashaIds(akashaIds);
                this.dispatch(profileActionCreators.moreFollowingIteratorSuccess(data, {
                    fetchingMoreFollowing: false
                }));
            }
        });
    };
    getFollowingsList = (akashaId) => {
        this.profileService.getFollowingsList({
            akashaId,
            onSuccess: data => this.dispatch(profileActionCreators.getFollowingsListSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.getFollowingsListError(error))
        });
    }
    addUpdateProfileDataAction = (profileData) => {
        this.appActions.addPendingAction({
            type: 'updateProfile',
            payload: { profileData },
            titleId: 'updateProfileTitle',
            messageId: 'updateProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    }

    addFollowProfileAction = (akashaId, profile) => {
        this.appActions.addPendingAction({
            type: 'followProfile',
            payload: { akashaId, profile },
            titleId: 'followProfileTitle',
            messageId: 'followProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    };

    addUnfollowProfileAction = (akashaId, profile) => {
        this.appActions.addPendingAction({
            type: 'unfollowProfile',
            payload: { akashaId, profile },
            titleId: 'unfollowProfileTitle',
            messageId: 'unfollowProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    };

    addSendTipAction = (payload) => {
        this.appActions.addPendingAction({
            type: 'sendTip',
            payload,
            titleId: 'sendTipTitle',
            messageId: 'sendTip',
            gas: 2000000,
            status: 'needTransferConfirmation'
        });
    };

    followProfile = (akashaId, gas, profile) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.followProfile({ followPending: flagOn }));
            this.profileService.follow({
                token: loggedProfile.get('token'),
                akashaId,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'followProfile',
                        akashaId: data.akashaId,
                        followedProfile: profile
                    }]);
                    this.appActions.showNotification({
                        id: 'followingProfile',
                        values: { akashaId: data.akashaId },
                        duration: 3000
                    });
                },
                onError: error =>
                    dispatch(profileActionCreators.followProfileError(error, {
                        followPending: flagOff
                    }))
            });
        });

    followProfileSuccess = (akashaId, profile) => {
        this.dispatch(profileActionCreators.followProfileSuccess(profile, {
            followPending: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: 'followProfileSuccess',
            values: { akashaId }
        });
    };

    unfollowProfile = (akashaId, gas, profile) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.unfollowProfile({ followPending: flagOn }));
            this.profileService.unfollow({
                token: loggedProfile.get('token'),
                akashaId,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'unfollowProfile',
                        akashaId: data.akashaId,
                        unfollowedProfile: profile
                    }]);
                    this.appActions.showNotification({
                        id: 'unfollowingProfile',
                        values: { akashaId: data.akashaId },
                        duration: 3000
                    });
                },
                onError: error =>
                    dispatch(profileActionCreators.unfollowProfileError(error, flagOff))
            });
        });

    unfollowProfileSuccess = (akashaId, profile) => {
        this.dispatch(profileActionCreators.unfollowProfileSuccess(profile, {
            followPending: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: 'unfollowProfileSuccess',
            values: { akashaId }
        });
    };

    isFollower = (akashaId, following) => {
        this.dispatch(profileActionCreators.isFollower({
            isFollowerPending: true
        }));
        this.profileService.isFollower({
            akashaId,
            following,
            onSuccess: data =>
                this.dispatch(profileActionCreators.isFollowerSuccess(data, {
                    isFollowerPending: false
                })),
            onError: error =>
                this.dispatch(profileActionCreators.isFollowerError(error, {
                    isFollowerPending: false
                }))
        });
    };

    sendTip = (akashaId, receiver, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.sendTip({ sendingTip: flagOn }));
            this.profileService.sendTip({
                token: loggedProfile.get('token'),
                akashaId,
                receiver,
                value,
                gas,
                onSuccess: (data) => {
                    this.transactionActions.listenForMinedTx();
                    this.transactionActions.addToQueue([{
                        tx: data.tx,
                        type: 'sendTip',
                        akashaId: data.akashaId,
                        gas
                    }]);
                    this.appActions.showNotification({
                        id: 'sendingTip',
                        values: { akashaId: data.akashaId },
                        duration: 3000
                    });
                },
                onError: error =>
                    dispatch(profileActionCreators.sendTipError(error, flagOff))
            });
        });

    sendTipSuccess = (akashaId, minedSuccessfully) => {
        this.dispatch(profileActionCreators.sendTipSuccess({
            sendingTip: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: minedSuccessfully ? 'sendTipSuccess' : 'sendTipError',
            values: { akashaId }
        });
    };

    clearFollowers = akashaId =>
        this.dispatch(profileActionCreators.clearFollowers(akashaId));

    clearFollowing = akashaId =>
        this.dispatch(profileActionCreators.clearFollowing(akashaId));

}
export { ProfileActions };
