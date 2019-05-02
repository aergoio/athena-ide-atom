import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const starsClass = 'stars';

export const Stars = (props) => {
  return (
    <table className={join(starsClass, props.class)}>
      {props.children}
    </table>
  );
};

Stars.propTypes = {
  class: PropTypes.class,
  children: PropTypes.element.isRequired
}

export default Stars;