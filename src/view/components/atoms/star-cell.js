import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const starsCellClass = 'star-cell';

export const StarsCell = (props) => {
  const rowspan = typeof props.rowspan == "undefined" ? "1" : props.rowspan;
  const colspan = typeof props.colspan == "undefined" ? "1" : props.colspan;
  return (
    <td rolspan={rowspan} colSpan={colspan} className={join(starsCellClass, props.class)}>
      {props.children}
    </td>
  );
};

StarsCell.propTypes = {
  class: PropTypes.class,
  rowspan: PropTypes.number,
  colspan: PropTypes.number,
  children: PropTypes.element.isRequired
}

export default StarsCell;