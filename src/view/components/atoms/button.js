import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

export const Button = (props) => {
  return (
    <div className={join('btn', 'inline-block', props.class)} onClick={props.onClick}>
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