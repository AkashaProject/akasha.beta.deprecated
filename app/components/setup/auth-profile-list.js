import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Avatar, DataLoader, LoginForm } from '../';
import clickAway from '../../utils/clickAway';
import { isVisible } from '../../utils/domUtils';
import { setupMessages } from '../../locale-data/messages';

class AuthProfileList extends Component {
    container = null;
    selectedElement = null;
    state = {
        hoveredAccount: null,
        selectedAccount: null
    };

    componentDidUpdate (prevProps, prevState) {
        const { selectedAccount } = this.state;
        if (selectedAccount && selectedAccount !== prevState.selectedAccount) {
            this.clearTimeout();
            // This check is delayed because the transitions must be finished first
            this.timeout = setTimeout(this.checkIfVisible, 310, [selectedAccount]);
        }
    }

    componentWillUnmount () {
        this.clearTimeout();
    }

    componentClickAway = () => {
        this.setState({
            selectedAccount: null
        });
    };

    clearTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    checkIfVisible = (selectedAccount) => {
        const el = document.getElementById(`account-${selectedAccount}`);
        const { visible, scrollTop } = isVisible(el, this.container);
        if (el && this.container && !visible) {
            this.container.scrollTop -= scrollTop;
        }
        if (this.input) {
            this.input.focus();
        }
        this.timeout = null;
    }

    getContainerRef = (el) => {
        const { getListContainerRef } = this.props;
        this.container = el;
        if (getListContainerRef) {
            getListContainerRef(el);
        }
    };

    getInputRef = (el) => {
        if (el) {
            this.input = el;
        }
    };

    onCancelLogin = () => {
        this.setState({
            selectedAccount: null
        });
    };

    onSubmitLogin = () => {};

    onMouseEnter = (account) => {
        this.setState({
            hoveredAccount: account,
        });
    };

    onMouseLeave = () => {
        this.setState({
            hoveredAccount: null
        });
    };

    onSelectAccount = (account) => {
        this.setState({
            selectedAccount: account
        });
    };

    renderListItem = (account, profile) => {
        const { hoveredAccount, selectedAccount } = this.state;
        const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const avatar = profile.get('avatar');
        const akashaId = profile.get('akashaId');
        const isSelected = account === selectedAccount;
        const isHovered = account === hoveredAccount && !isSelected;
        const onClick = isSelected ? undefined : () => this.onSelectAccount(account);
        const header = (
          <div className="auth-profile-list__card-header">
            <Avatar
              className="auth-profile-list__avatar"
              firstName={profile.get('firstName')}
              image={avatar}
              lastName={profile.get('lastName')}
            />
            <div className="auth-profile-list__header-text">
              <div className="overflow-ellipsis heading auth-profile-list__name">
                {akashaId ? profileName : account}
              </div>
              {akashaId &&
                <div className="auth-profile-list__akasha-id">
                  <small>@{akashaId}</small>
                </div>
              }
            </div>
          </div>
        );

        return (
          <div
            className="auth-profile-list__profile-card"
            id={`account-${account}`}
            key={account}
            onClick={onClick}
            onMouseEnter={() => this.onMouseEnter(account)}
            onMouseLeave={this.onMouseLeave}
            style={{
                backgroundColor: isHovered ? '#fcfcfc' : '#fff',
                opacity: selectedAccount && !isSelected ? 0.3 : 1
            }}
          >
            {header}
            <ReactCSSTransitionGroup
              transitionName="loginForm"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {isSelected &&
                <LoginForm
                  account={account}
                  akashaId={akashaId}
                  getInputRef={this.getInputRef}
                  onCancel={this.onCancelLogin}
                  onSubmit={this.onSubmitLogin}
                  profile={profile.get('profile')}
                />
              }
            </ReactCSSTransitionGroup>
          </div>
        );
    };

    render () {
        const { fetchingProfiles, profiles, gethStatus, intl, ipfsStatus } = this.props;
        let placeholderMessage;

        if (!gethStatus.get('process')) {
            placeholderMessage = intl.formatMessage(setupMessages.gethStopped);
        } else if (!ipfsStatus.get('process') && !ipfsStatus.get('started')) {
            placeholderMessage = intl.formatMessage(setupMessages.ipfsStopped);
        } else if (profiles.size === 0 && !fetchingProfiles) {
            placeholderMessage = intl.formatMessage(setupMessages.noProfilesFound);
        }

        if (placeholderMessage) {
            this.getContainerRef(null);
            return (
              <div className="auth-profile-list__placeholder">
                {placeholderMessage}
              </div>
            );
        }

        return (
          <DataLoader flag={fetchingProfiles} style={{ paddingTop: '100px' }}>
            <div className="auth-profile-list__root">
              <div
                id="select-popup-container"
                className="auth-profile-list__list-wrapper"
                ref={this.getContainerRef}
              >
                {profiles.map(({ account, profile }) => this.renderListItem(account, profile))}
              </div>
            </div>
          </DataLoader>
        );
    }
}

AuthProfileList.propTypes = {
    fetchingProfiles: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    getListContainerRef: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
};

export default clickAway(AuthProfileList);