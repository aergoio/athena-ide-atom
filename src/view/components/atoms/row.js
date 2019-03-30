'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const rowClass = 'components-row';

export const Row = (props) => {
  return (
    <div className={join(rowClass, props.class)}>
      {props.children}
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.element.isRequired,
  class: PropTypes.class
};

export default Row;