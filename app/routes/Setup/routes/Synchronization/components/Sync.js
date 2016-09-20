import React, { Component, PropTypes } from 'react';
import SetupHeader from '../../../components/setup-header';
import { RaisedButton } from 'material-ui';
import SyncProgress from 'shared-components/Loaders/SyncProgress';
import { FormattedMessage, FormattedPlural, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import { is } from 'immutable';

class SyncStatus extends Component {
    constructor (props) {
        super(props);
        this.state = {
            syncData: null,
            syncError: null,
            gethLogs: [],
            showGethLogs: false
        };
    }
    componentWillMount () {
        this.startGeth();
    }
    componentDidMount () {
        this.startGeth();
    }
    getSyncStatus = () => {
        const { eProcActions, gethStatus, gethSyncStatus } = this.props;

        eProcActions.getSyncStatus().then((syncData) => {
            console.log(syncData, 'sync data');
        });
        // eProcActions.startUpdateSync((err, updateData) => {
        //     const { success, status, data } = updateData;
        //     if (err) {
        //         return this.setState({
        //             syncError: status.message
        //         });
        //     }
        //     if (success && data.empty) {
        //         this.finishSync();
        //     } else {
        //         this.setState({
        //             syncData: data
        //         });
        //     }
        //     return null;
        // });
    };
    startGeth = () => {
        const { eProcActions, eProcBundleActions, gethStatus } = this.props;
        return eProcBundleActions.startGeth();
    };
    checkGethStatus = () => {
        const { eProcActions } = this.props;
        eProcActions.getGethStatus();
    }
    finishSync = () => {
        const { eProcActions, eProcBundleActions } = this.props;
        let promises = [];
        promises.push(eProcActions.stopUpdateSync());
        promises.push(eProcBundleActions.startIPFS());
        Promise.all(promises).then(() => {
            this.context.router.push('authenticate');
        });
    };
    handleSync = () => {
        const { eProcActions, externalProcState } = this.props;
        // if (externalProcState.get('actionId') === 1) {
        //     return eProcActions.stopSync();
        // }
        // eProcActions.startSync();
        return this.getSyncStatus();
    };
    handleCancel = () => {
        const { eProcBundleActions } = this.props;
        eProcBundleActions.requestCancelSync().then(() => {
            this.context.router.push('setup');
        });
    };
    _getActionLabels = () => {
        const { externalProcState, intl } = this.props;
        const labels = {};
        switch (externalProcState.get('actionId')) {
            case 1:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
                break;
            case 2:
                labels.title = intl.formatMessage(setupMessages.syncStopped);
                labels.action = intl.formatMessage(generalMessages.start);
                break;
            case 3:
                labels.title = intl.formatMessage(setupMessages.syncCompleted);
                labels.action = intl.formatMessage(generalMessages.completed);
                break;
            case 4:
                labels.title = intl.formatMessage(setupMessages.syncResuming);
                labels.action = intl.formatMessage(generalMessages.starting);
                break;
            default:
                labels.title = intl.formatMessage(setupMessages.synchronizing);
                labels.action = intl.formatMessage(generalMessages.pause);
        }
        return labels;
    };
    _handleDetails = () => {
        const { loggerActions } = this.props;
        if (!this.state.showGethLogs) {
            return loggerActions.startGethLogger({ continuous: true }, (err, logs) => {
                if (err) return console.error(err);
                const logData = this.state.gethLogs.slice();
                if (logs.data.length > 1) {
                    logData.concat(logs.data);
                } else {
                    logData.unshift(logs.data['log-geth'][0]);
                }
                return this.setState({
                    showGethLogs: true,
                    gethLogs: logData.slice(0, 20)
                });
            });
        }
        return loggerActions.stopGethLogger(() => {
            this.setState({
                showGethLogs: false,
                gethLogs: []
            });
        });
    };
    render () {
        const { intl, gethStatus, eProcActions, gethSyncStatus } = this.props;
        let blockSync;
        let blockProgress;
        let currentProgress;
        let pageTitle;
        let progressBody;
        let peerInfo;
        pageTitle = this._getActionLabels().title;
        if (gethSyncStatus && gethSyncStatus.get('peerCount') > 0 && gethSyncStatus.get('highestBlock') > 0) {
            blockProgress = gethSyncStatus;
            currentProgress = ((blockProgress.get('currentBlock') - blockProgress.get('startingBlock')) /
                (blockProgress.get('highestBlock') - blockProgress.get('startingBlock'))) * 100;
            peerInfo = (
              <FormattedPlural
                value={gethSyncStatus.get('peerCount')}
                one={intl.formatMessage(setupMessages.onePeer)}
                few={intl.formatMessage(setupMessages.fewPeers)}
                many={intl.formatMessage(setupMessages.manyPeers)}
                other={intl.formatMessage(setupMessages.peers)}
              />
            );
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {`${gethSyncStatus.get('peerCount')}`}&nbsp;
                  {peerInfo}&nbsp;
                  {`${intl.formatMessage(generalMessages.connected)}`}
                </div>
                <div style={{ fontSize: '20px' }} >
                  <strong style={{ fontWeight: 'bold' }} >
                    {blockProgress.currentBlock}
                  </strong>/
                    {blockProgress.highestBlock}
                </div>
              </div>
            );
        } else if (gethStatus.get('downloading')) {
            peerInfo = intl.formatMessage(setupMessages.downloadingGeth);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {peerInfo}
                </div>
              </div>
            );
        } else {
            peerInfo = intl.formatMessage(setupMessages.findingPeers);
            progressBody = (
              <div>
                <div style={{ fontWeight: 'bold', padding: '5px', fontSize: '16px' }} >
                  {peerInfo}
                </div>
              </div>
            );
        }
        blockSync = (
          <div style={{ padding: '64px 0', textAlign: 'center' }} >
            <SyncProgress value={currentProgress} />
              {progressBody}
          </div>
        );
        return (
          <PanelContainer
            showBorder
            actions={[
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                style={{ marginLeft: '12px' }}
                onClick={this.handleCancel}
              />,
              <RaisedButton
                key="pauseOrResume"
                label={this._getActionLabels().action}
                style={{ marginLeft: '12px' }}
                onClick={this.handleSync}
              />
            ]}
            leftActions={[
              <RaisedButton
                key="viewDetails"
                label={this.state.showGethLogs ? 'Hide details' : 'View details'}
                primary={this.state.showGethLogs}
                onClick={this._handleDetails}
              />
            ]}
            header={<SetupHeader title="AKASHA" />}
          >
            <div
              className="col-xs"
              style={{ flex: 1, padding: 0 }}
            >
              <h1 style={{ fontWeight: '400' }} >{pageTitle}</h1>
              <div>
                <p>
                  <FormattedMessage {...setupMessages.onSyncStart} />
                </p>
              </div>
              {blockSync}
            </div>
              {this.state.showGethLogs &&
                <ul style={this.props.logListStyle} className="col-xs-12">
                  {this.state.gethLogs.map((log, key) => (
                    <li
                      key={key}
                      style={{
                          marginBottom: '8px',
                          backgroundColor: (
                            log.level === 'warn' ?
                                'orange' : log.level === 'error' ?
                                'red' : 'transparent')
                      }}
                    >
                      <abbr title="Log Level">{log.level}</abbr>
                      <p>{log.message}</p>
                    </li>
                    ))
                    }
                </ul>
                }
          </PanelContainer>
        );
    }
}

SyncStatus.propTypes = {
    eProcActions: PropTypes.object.isRequired,
    eProcBundleActions: PropTypes.object.isRequired,
    loggerActions: PropTypes.object.isRequired,
    style: PropTypes.object,
    logListStyle: PropTypes.object,
    intl: PropTypes.object,
    settingsState: PropTypes.object.isRequired
};

SyncStatus.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

SyncStatus.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    logListStyle: {
        maxHeight: 330,
        overflowY: 'scroll',
        paddingLeft: 4,
        overflowX: 'hidden',
        fontFamily: 'Consolas',
        backgroundColor: 'rgba(0,0,0,0.02)'
    }
};
export default injectIntl(SyncStatus);
