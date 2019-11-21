import React from 'react';
import PropTypes from 'prop-types';

const argumentRowClass = 'argument-row';

export const ArgumentRow = (props) => {
  return (
    <div className={[argumentRowClass, props.class].join(' ')}>
      {props.children}
    </div>
  );
};

ArgumentRow.propTypes = {
  children: PropTypes.element.isRequired,
  class: PropTypes.class
};

export default ArgumentRow;
