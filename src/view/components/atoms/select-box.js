import React from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';

const selectBoxClass = 'component-selectbox';

export const SelectBox = (props) => {
  const injectedClass = props.class;
  const value = props.value;
  const options = props.options;
  const placeholder = typeof props.placeholder === "undefined" ? "select an item" : props.placeholder;
  const onChange = props.onChange;
  const arrowClassName = selectBoxClass + '__arrow';
  return (
    <Dropdown // main dropdown component
      className={['inline-block', selectBoxClass, injectedClass].join(' ')}
      controlClassName={selectBoxClass + '__control'}
      placeholderClassName={selectBoxClass + '__placeholder'}
      menuClassName={selectBoxClass + '__menu'}
      arrowClassName={arrowClassName}
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={o => onChange(o.value)}
    />
  );
};

SelectBox.propTypes = {
  class: PropTypes.class,
  value: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default SelectBox;
