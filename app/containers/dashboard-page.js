import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Carousel, Modal } from 'antd';
import { Dashboard, DataLoader } from '../components';
import { dashboardCreateNew, dashboardHideTutorial, dashboardSetActive,
    dashboardUpdateNewColumn, dashboardReorderColumn } from '../local-flux/actions/dashboard-actions';
import { selectEntryFlag, selectFullEntry } from '../local-flux/selectors';
import { setupMessages, generalMessages } from '../locale-data/messages';

class DashboardPage extends Component {
    state = {
        carouselEnd: false,
        modalVisible: this.props.firstDashboardReady
    }

    dashboardRef = null;

    componentWillReceiveProps (nextProps) {
        if (!nextProps.activeDashboard) {
            return;
        }
        const { params } = nextProps.match;
        if (!params.dashboardId && this.props.match.params.dashboardId) {
            this.props.dashboardSetActive('');
        }
        if (params.dashboardId !== this.props.match.params.dashboardId) {
            this.props.dashboardSetActive(params.dashboardId);
        }
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.newColumn && this.props.newColumn && this.dashboardRef) {
            this.dashboardRef.scrollLeft = 9999;
        }
    }

    getDashboardRef = (el) => { this.dashboardRef = el; };

    handleClose = () => {
        this.setState({ modalVisible: false });
        this.props.dashboardHideTutorial();
    }

    handleCarouselChange = (newIndex) => {
        if (newIndex === 2) {
            this.setState({ carouselEnd: true });
        }
    }

    render () {
        const { intl, columns, darkTheme, dashboards, homeReady, isHidden } = this.props;
        const modalFooterBtn = this.state.carouselEnd ?
            (<Button key="submit" type="primary" onClick={this.handleClose}>
              {intl.formatMessage(generalMessages.okTutorial)}
            </Button>) :
            (<Button key="next" type="primary" onClick={() => this.slider.next()}>
              {intl.formatMessage(generalMessages.next)}
            </Button>);

        return (
          <div style={{ height: '100%', display: isHidden ? 'none' : 'initial' }}>
            <Modal
              title={intl.formatMessage(setupMessages.tutorialTitle)}
              className="tutorial-modal"
              visible={this.state.modalVisible}
              onOk={this.handleClose}
              onCancel={this.handleClose}
              footer={[
                modalFooterBtn,
              ]}
              width="50%"
            >
              <Carousel
                ref={(c) => { this.slider = c; }}
                afterChange={this.handleCarouselChange}
              >
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__test-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialEth)}
                  </div>
                </div>
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__aeth-wallet-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialMana)}
                  </div>
                </div>
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__mana-popover-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialManaAlt)}
                  </div>
                </div>
              </Carousel>
            </Modal>
            <DataLoader flag={!homeReady} size="large" style={{ paddingTop: '200px' }}>
              <div style={{ height: '100%' }}>
                <Dashboard
                  columns={columns}
                  darkTheme={darkTheme}
                  dashboardCreateNew={this.props.dashboardCreateNew}
                  dashboards={dashboards}
                  getDashboardRef={this.getDashboardRef}
                  navigateRight={this.navigateRight}
                  updateNewColumn={this.props.dashboardUpdateNewColumn}
                  dashboardReorderColumn={this.props.dashboardReorderColumn}
                  activeDashboardId={this.props.activeDashboard}
                />
              </div>
            </DataLoader>
          </div>
        );
    }
}

DashboardPage.propTypes = {
    activeDashboard: PropTypes.string,
    columns: PropTypes.shape(),
    darkTheme: PropTypes.bool,
    dashboards: PropTypes.shape(),
    dashboardCreateNew: PropTypes.func.isRequired,
    dashboardHideTutorial: PropTypes.func,
    dashboardSetActive: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    firstDashboardReady: PropTypes.bool,
    homeReady: PropTypes.bool,
    intl: PropTypes.shape(),
    isHidden: PropTypes.bool,
    match: PropTypes.shape(),
    newColumn: PropTypes.shape(),
    dashboardReorderColumn: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        columns: state.dashboardState.get('columnById'),
        darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
        dashboards: state.dashboardState.get('byId'),
        entryPageOverlay: state.entryState.get('entryPageOverlay'),
        firstDashboardReady: state.dashboardState.getIn(['flags', 'firstDashboardReady']),
        homeReady: state.appState.get('homeReady'),
        isHidden: !!selectFullEntry(state) || !!selectEntryFlag(state, 'fetchingFullEntry'),
        newColumn: state.dashboardState.get('newColumn')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardCreateNew,
        dashboardHideTutorial,
        dashboardSetActive,
        dashboardUpdateNewColumn,
        dashboardReorderColumn,
    }
)(injectIntl(DashboardPage));
