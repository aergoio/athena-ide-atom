import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const argumentRowClass = 'argument-row';

export const ArgumentRow = (props) => {
  return (
    <div className={join(argumentRowClass, props.class)}>
      {props.children}
    </div>
  );
};

ArgumentRow.propTypes = {
  children: PropTypes.element.isRequired,
  class: PropTypes.class
};

export default ArgumentRow;
