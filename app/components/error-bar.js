import PropTypes from 'prop-types';
import React from 'react';
import { Snackbar } from 'material-ui';
import { errorMessages, generalMessages } from '../locale-data/messages';

const ErrorBar = ({ deleteError, error, intl }, { muiTheme }) => {
    const { palette } = muiTheme;
    const message = error.get('messageId') ?
        intl.formatMessage(errorMessages[error.get('messageId')]) :
        error.get('message');
    return (
      <Snackbar
        style={{ maxWidth: '80%' }}
        bodyStyle={{ maxWidth: 'none', backgroundColor: palette.errorColor }}
        contentStyle={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            overflow: 'hidden',
            color: palette.alternateTextColor
        }}
        action={
          <span style={{ color: palette.primary1Color }}>
            {intl.formatMessage(generalMessages.ok)}
          </span>
        }
        onActionTouchTap={() => deleteError(error.get('id'))}
        message={message}
        open
        onRequestClose={() => deleteError(error.get('id'))}
      />
    );
};

ErrorBar.propTypes = {
    deleteError: PropTypes.func.isRequired,
    error: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
};

ErrorBar.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default ErrorBar;