import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const voidClass = 'void';

export const Void = (props) => {
  return (
    <div className={join(voidClass, props.class)}>
      {props.children}
    </div>
  );
};

Void.propTypes = {
  class: PropTypes.class,
  children: PropTypes.element.isRequired
}

export default Void;