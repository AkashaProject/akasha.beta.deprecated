import React, { PropTypes } from 'react';
import '../../styles/core.scss';

// Note: Stateless/function shared-components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// LoginLayout is a pure function of its props, so we can
// define it with a plain javascript function...
const style = {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '500px'
};
function LoginLayout ({ children }) {
    return (
      <div
        className="row"
      >
        <div className="col-xs-6">
        {children}
        </div>
      </div>
    );
}

LoginLayout.propTypes = {
    children: PropTypes.element
};

export default LoginLayout;