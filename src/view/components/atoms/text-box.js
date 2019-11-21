import React from 'react';
import PropTypes from 'prop-types';

const testBoxClass = 'component-textbox';

export const TextBox = (props) => {
  return (
    <div className={['inline-block', testBoxClass, props.class].join(' ')}>
      {props.text}
    </div>
  );
};

TextBox.propTypes = {
  text: PropTypes.string,
  class: PropTypes.class
};

export default TextBox;
