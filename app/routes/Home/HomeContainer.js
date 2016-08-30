import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { BootstrapBundleActions } from 'local-flux';
import SideBar from 'shared-components/Sidebar/side-bar';
import '../../styles/core.scss';
import styles from './styles.css';
import PanelLoader from './components/panel-loader-container';

function HomeContainer ({ children }) {
    return (
      <div style={{ height: '100%' }}>
        <div
          style={{ width: '64px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 999 }}
        >
          <SideBar />
        </div>
        <div
          className={styles.panelLoader}
          style={{ position: 'absolute', left: 64, top: 0, bottom: 0, zIndex: 990 }}
        >
          <PanelLoader />
        </div>
        <div
          className={styles.entryLoader}
        >
          EntryWindow
        </div>
        <div className="col-xs-12" style={{ paddingLeft: '64px' }} >
          {children}
        </div>
      </div>
    );
}

HomeContainer.propTypes = {
    children: PropTypes.element
};

function mapStateToProps () {
    return {};
}

function mapDispatchToProps () {
    return {};
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        Promise.resolve(bootstrapActions.initHome(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer));
