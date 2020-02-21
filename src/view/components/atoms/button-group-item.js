import React from 'react';
import PropTypes from 'prop-types';

const buttonGroupItemClass = 'component-btn-group-item';

export const ButtonGroupItem = (props) => {
  let classes;
  if (props.selected) {
    classes = ['btn', 'selected', buttonGroupItemClass, props.class]
  } else {
    classes = ['btn', buttonGroupItemClass, props.class]
  }
  const name = props.name;
  const onClick = props.onClick;
  return (
    <button className={classes.join(' ')} onClick={onClick}>
      {name}
    </button>
  );
};

ButtonGroupItem.propTypes = {
  class: PropTypes.class,
  selected: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.func,
}

export default ButtonGroupItem;
