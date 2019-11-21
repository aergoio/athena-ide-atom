import React from 'react';
import PropTypes from 'prop-types';

export const AddIcon = (props) => {
  return (
    <div
      className={['inline-block', 'icon-diff-added', 'component-icon'].join(' ')}
      onClick={props.onClick}>
    </div>
  );
};

AddIcon.propTypes = {
  onClick: PropTypes.func
};

export default AddIcon;
