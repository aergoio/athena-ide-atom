import React from 'react';
import PropTypes from 'prop-types';

export const SyncIcon = (props) => {
  return (
    <div
      className={['inline-block', 'icon-sync', 'component-icon'].join(' ')}
      onClick={props.onClick}>
    </div>
  );
};

SyncIcon.propTypes = {
  onClick: PropTypes.func
};

export default SyncIcon;
