'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const testBoxClass = 'component-textbox';

export const TextBox = (props) => {
  return (
    <div className={join('inline-block', testBoxClass, props.class)}>
      {props.text}
    </div>
  );
};

TextBox.propTypes = {
  text: PropTypes.string,
  class: PropTypes.class
};

export default TextBox;