import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Icon, Popover, Progress, Tooltip } from 'antd';
import { ClaimableList, PieChart, ShiftForm } from '../';
import * as actionTypes from '../../constants/action-types';
import { actionAdd, actionGetClaimable } from '../../local-flux/actions/action-actions';
import { selectBalance, selectLoggedEthAddress,
    selectPendingTransformEssence } from '../../local-flux/selectors';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { balanceToNumber, formatBalance } from '../../utils/number-formatter';

const COLLECT = 'collect';
const DEFAULT = 'default';
const FORGE = 'forge';

class EssencePopover extends Component {
    state = {
        page: DEFAULT,
        popoverVisible: false
    };

    componentDidMount () {
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible
        });
        if (popoverVisible) {
            this.props.actionGetClaimable();
        }

        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.setState({
                    page: DEFAULT
                });
            }, 100);
        }
    };

    onCollect = () => { this.setState({ page: COLLECT }); };

    onForge = () => { this.setState({ page: FORGE }); };

    onCancel = () => { this.setState({ page: DEFAULT }); };

    onShiftDownSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.cycleAeth, { amount });
    };

    onShiftUpSubmit = (amount) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, actionTypes.bondAeth, { amount });
    };

    renderContent = () => {
        const { balance, intl, pendingTransformEssence } = this.props;
        const { page } = this.state;
        const essenceColor = '#02c79a';
        if (page === COLLECT) {
            return (
              <ClaimableList />
            );
        }

        if (page === FORGE) {
            return (
              <ShiftForm
                balance={balance}
                onCancel={this.onCancel}
                onShift={this.onShiftUpSubmit}
                pendingShift={pendingTransformEssence}
                type="transformEssence"
              />
            );
        }

        return (
          <div className="essence-popover__content">
            <div className="flex-center-x essence-popover__title">
              {intl.formatMessage(generalMessages.essence)}
              <span className="essence-popover__essence-score">
                {formatBalance(balance.getIn(['essence', 'total']))}
              </span>
            </div>
            <div className="essence-popover__chart-wrapper">
              <PieChart
                data={{
                    labels: ['Comments', 'Entries', 'Votes'],
                    datasets: [{
                        data: [10, 20, 30],
                        backgroundColor: ['#05a686', '#41dbcc', '#a6f0f0']
                    }]
                }}
                options={{
                    legend: { display: false },
                    tooltips: {
                        displayColors: false
                    }
                }}
                width={240}
                height={240}
              />
            </div>
            <div className="essence-popover__actions">
              <Button
                className="essence-popover__button"
                onClick={this.onCollect}
                size="large"
              >
                {intl.formatMessage(generalMessages.collect)}
              </Button>
              <Button
                className="essence-popover__button"
                onClick={this.onForge}
                size="large"
              >
                {intl.formatMessage(formMessages.forgeAeth)}
              </Button>
            </div>
          </div>
        );
    };

    render () {
        const { balance, intl } = this.props;
        const total = balanceToNumber(balance.getIn(['essence', 'total']));
        // 1000 Essence should be considered the first step because it unlocks creating tags
        const firstStep = 1000;
        const percent = (total / firstStep) * 100;
        const tooltip = (
          <div>
            <div>{intl.formatMessage(generalMessages.essence)}</div>
            <div>{total} / {firstStep}</div>
          </div>
        );

        return (
          <Popover
            content={this.renderContent()}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="essence-popover"
            placement="leftBottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <Tooltip title={tooltip}>
              <Progress
                className="essence-popover__progress"
                format={() => <Icon type="question-circle-o" />}
                percent={percent}
                strokeWidth={10}
                type="circle"
                width={32}
              />
            </Tooltip>
          </Popover>
        );
    }
}

EssencePopover.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    actionGetClaimable: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
    pendingTransformEssence: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransformEssence: selectPendingTransformEssence(state),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        actionGetClaimable
    }
)(Form.create()(injectIntl(EssencePopover)));