import React from 'react';
import PropTypes from 'prop-types';

const buttonClass = 'component-btn';
const disabledButtonClass = 'component-btn-disabled';

export const Button = (props) => {
  let classes;
  let onClick;
  if (typeof props.disabled === "undefined" || !props.disabled) {
    classes = ['inline-block', buttonClass, props.class, buttonClass].join(' ');
    onClick = props.onClick;
  } else {
    classes = ['inline-block', buttonClass, props.class, disabledButtonClass].join(' ');
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
