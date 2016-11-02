import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions, EntryActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoader from './components/panel-loader-container';
import EntryModal from './components/entry-modal';
import ProfileUpdater from './components/profile-updater';
import PublishEntryRunner from './components/publish-entry-runner';

class HomeContainer extends React.Component {
    componentWillMount () {
        const { profileActions } = this.props;
        profileActions.resetFlags();
    }
    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.getLoggedProfile();
    }
    componentWillReceiveProps (nextProps) {
        const { profileActions, entryActions, draftActions } = this.props;
        const { loggedProfile, fetchingLoggedProfile } = nextProps;

        if (!loggedProfile.get('account') && !fetchingLoggedProfile) {
            this.context.router.push('/authenticate/');
        }
        if (loggedProfile && loggedProfile.get('profile')) {
            profileActions.getProfileData([{ profile: loggedProfile.get('profile') }]);
            draftActions.getDraftsCount(loggedProfile.get('profile'));
            entryActions.getEntriesCount(loggedProfile.get('profile'));
            draftActions.getPublishingDrafts(loggedProfile.get('profile'));
        }
    }
    componentWillUnmount () {
        this.props.appActions.hidePanel();
    }
    _getLoadingMessage = () => {
        const { fetchingDraftsCount, fetchingEntriesCount, fetchingLoggedProfile,
            fetchingProfileData } = this.props;
        if (fetchingLoggedProfile) {
            return 'Loading profile';
        }
        if (fetchingProfileData) {
            return 'Loading profile data';
        }
        if (fetchingDraftsCount) {
            return 'Loading drafts';
        }
        if (fetchingEntriesCount) {
            return 'Loading your published entries';
        }
        return 'Loading...';
    }

    updateProfileData = (profileData) => {
        const { profileActions, loggedProfile } = this.props;
        profileActions.updateProfileData(profileData, loggedProfile);
    };

    render () {
<<<<<<< 2840649d89117bf7aa075b6d6e292a2a38706118
        const { appActions, draftActions, fetchingLoggedProfile, fetchingProfileData, loggedProfileData,
            profileActions, entriesCount, draftsCount, loggedProfile, activePanel,
            fetchingDraftsCount, fetchingPublishedEntries, params,
            fetchingFullLoggedProfile, loginRequested, updatingProfile } = this.props;
=======
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData, profileActions,
            entriesCount, draftsCount, loggedProfile, activePanel, params } = this.props;
>>>>>>> chore(entryPublishing): Entry publishing
        const profileAddress = loggedProfile.get('profile');
        const account = loggedProfile.get('account');
        const loadingInProgress = !loggedProfileData || fetchingLoggedProfile;

        if (loadingInProgress) {
            return (
              <div>{this._getLoadingMessage()}</div>
            );
        }
        if (!account) {
            return <div>Logging out...</div>;
        }
        return (
          <div className={styles.root} >
            <div className={styles.sideBar} >
              <Sidebar
                activePanel={activePanel}
                account={account}
                appActions={appActions}
                draftActions={draftActions}
                loggedProfileData={loggedProfileData}
                profileActions={profileActions}
                entriesCount={entriesCount}
                draftsCount={draftsCount}
              />
            </div>
            <div className={styles.panelLoader} >
              <PanelLoader
                profile={loggedProfileData}
                profileAddress={profileAddress}
                params={params}
                showPanel={appActions.showPanel}
                hidePanel={appActions.hidePanel}
                profileActions={profileActions}
                fetchingFullLoggedProfile={fetchingFullLoggedProfile}
                updateProfileData={this.updateProfileData}
                updatingProfile={updatingProfile}
                loginRequested={loginRequested}
              />
            </div>
            <EntryModal />
            <ProfileUpdater />
            <div className={`col-xs-12 ${styles.childWrapper}`} >
              {this.props.children}
            </div>
            <PublishEntryRunner />
          </div>
        );
    }
}

HomeContainer.propTypes = {
    activePanel: PropTypes.string,
    appActions: PropTypes.shape(),
    children: PropTypes.element,
    draftActions: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    fetchingLoggedProfile: PropTypes.bool,
    fetchingFullLoggedProfile: PropTypes.bool,
    fetchingProfileData: PropTypes.bool,
    fetchingDraftsCount: PropTypes.bool,
    fetchingPublishedEntries: PropTypes.bool,
    loginRequested: PropTypes.bool,
    fetchingEntriesCount: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    updatingProfile: PropTypes.bool,
    profileActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    params: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingFullLoggedProfile: state.profileState.get('fetchingFullLoggedProfile'),
        fetchingLoggedProfile: state.profileState.getIn(['flags', 'fetchingLoggedProfile']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        fetchingDraftsCount: state.draftState.getIn(['flags', 'fetchingDraftsCount']),
        fetchingPublishedEntries: state.draftState.get('fetchingPublishedEntries'),
        fetchingPublishingDrafts: state.draftState.getIn(['flags', 'fetchingPublishingDrafts']),
        fetchingEntriesCount: state.entryState.getIn(['flags', 'fetchingEntriesCount']),
        activePanel: state.panelState.get('activePanel').get('name'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        entriesCount: state.entryState.get('entriesCount'),
        draftsCount: state.draftState.get('draftsCount'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        draftActions: new DraftActions(dispatch),
        entryActions: new EntryActions(dispatch),
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);
