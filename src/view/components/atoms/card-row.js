import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const rowClass = 'card-row';

export const CardRow = (props) => {
  return (
    <div className={join(rowClass, props.class)}>
      {props.children}
    </div>
  );
};

CardRow.propTypes = {
  children: PropTypes.element.isRequired,
  class: PropTypes.class
};

export default CardRow;
