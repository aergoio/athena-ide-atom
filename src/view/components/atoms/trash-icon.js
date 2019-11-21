import React from 'react';
import PropTypes from 'prop-types';

export const TrashIcon = (props) => {
  return (
    <div
      className={['inline-block', 'icon-trashcan', 'component-icon'].join(' ')}
      onClick={props.onClick}>
    </div>
  );
};

TrashIcon.propTypes = {
  onClick: PropTypes.func
};

export default TrashIcon;
