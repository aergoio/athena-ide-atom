import React from 'react';
import PropTypes from 'prop-types';

const radioButtonClass = 'component-radio-btn';
const radioButtonLabelClass = 'component-radio-btn-label';
const radioButtonInputClass = 'component-radio-btn-input';

export const RadioButton = (props) => {
  const checked = props.checked;
  const onClick = props.onClick;
  const name = props.name;
  const text = props.text;
  return (
    <div className={['inline-block', radioButtonClass].join(' ')}>
      <label className={[radioButtonLabelClass].join(' ')} >
        <input
          type='radio'
          className={[radioButtonInputClass].join(' ')}
          name={name}
          checked={checked}
          onClick={onClick}
        />
        {text}
      </label>
    </div>
  );
};

RadioButton.propTypes = {
  class: PropTypes.class,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string,
  text: PropTypes.string,
}

export default RadioButton;
