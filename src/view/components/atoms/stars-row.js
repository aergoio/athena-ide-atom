import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const starsRowClass = 'stars-row';

export const StarsRow = (props) => {
  return (
    <tr className={join(starsRowClass, props.class)}>
      {props.children}
    </tr>
  );
};

StarsRow.propTypes = {
  class: PropTypes.class,
  children: PropTypes.element.isRequired
}

export default StarsRow;