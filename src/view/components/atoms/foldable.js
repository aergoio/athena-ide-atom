import React from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';

const foldableClass = 'foldable';

export const Foldable = (props) => {
  const triggerBaseClass = typeof props.triggerBaseClass === "undefined" ? foldableClass : props.triggerBaseClass;
  const trigger = props.trigger;
  const children = props.children;
  const open = typeof props.isOpen === "undefined" ? true : props.isOpen;
  const transitionTime = typeof props.transitionTime === "undefined" ? 100 : props.transitionTime;
  return (
    <Collapsible
      classParentString={foldableClass}
      className={foldableClass + '-closed'}
      openedClassName={foldableClass + '-opened'}
      triggerClassName={triggerBaseClass + '-trigger-closed'}
      triggerOpenedClassName={triggerBaseClass + '-trigger-opened'}
      trigger={trigger}
      open={open}
      transitionTime={transitionTime} // ms
    >
      {children}
    </Collapsible>
  );
};

Foldable.propTypes = {
  triggerBaseClass: PropTypes.class,
  trigger: PropTypes.any.isRequired,
  children: PropTypes.element.isRequired,
  isOpen: PropTypes.bool,
  transitionTime: PropTypes.number,
}

export default Foldable;
