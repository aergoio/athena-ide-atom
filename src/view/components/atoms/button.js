import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const buttonClass = 'component-btn';

export const Button = (props) => {
  return (
    <div className={join('inline-block', buttonClass, props.class)} onClick={props.onClick}>
      {props.name}
    </div>
  );
};

Button.propTypes = {
  class: PropTypes.class,
  onClick: PropTypes.func,
  name: PropTypes.string
}

export default Button;
