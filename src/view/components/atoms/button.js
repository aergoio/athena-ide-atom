import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const buttonClass = 'component-btn';
const disabledButtonClass = 'component-btn-disabled';

export const Button = (props) => {
  let buttonComponent;
  if (typeof props.disabled === "undefined" || !props.disabled) {
    buttonComponent = (
      <div className={join('inline-block', buttonClass, props.class, buttonClass)} onClick={props.onClick}>
        {props.name}
      </div>
    );
  } else {
    buttonComponent = (
      <div className={join('inline-block', buttonClass, props.class, disabledButtonClass)} >
        {props.name}
      </div>
    );
  }
  return (
    <div className='inline-block'>
      {buttonComponent}
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
