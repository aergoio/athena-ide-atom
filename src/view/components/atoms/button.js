import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const buttonClass = 'component-btn';
const disabledButtonClass = 'component-btn-disabled';

export const Button = (props) => {
  let classes;
  let onClick;
  if (typeof props.disabled === "undefined" || !props.disabled) {
    classes = join('inline-block', buttonClass, props.class, buttonClass);
    onClick = props.onClick;
  } else {
    classes = join('inline-block', buttonClass, props.class, disabledButtonClass);
    onClick = undefined;
  }
  return (
    <div className={classes} onClick={onClick}>
      {props.name}
    </div>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  class: PropTypes.class,
  onClick: PropTypes.func,
  name: PropTypes.string
}

export default Button;
