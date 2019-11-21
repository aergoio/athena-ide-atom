import React from 'react';
import PropTypes from 'prop-types';

export const CopyIcon = (props) => {
  return (
    <div
      className={['inline-block', 'icon-clippy', 'component-icon'].join(' ')}
      onClick={props.onClick}>
    </div>
  );
};

CopyIcon.propTypes = {
  onClick: PropTypes.func
};

export default CopyIcon;
