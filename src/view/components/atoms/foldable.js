import React from 'react';
import Collapsible from 'react-collapsible';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const foldableClass = 'foldable';

export const Foldable = (props) => {
  const trigger = props.trigger;
  const children = props.children;
  const open = typeof props.isOpen === "undefined" ? true : props.isOpen;
  const transitionTime = typeof props.transitionTime === "undefined" ? 100 : props.transitionTime;
  const onOpen = props.onOpen;
  const onClose = props.onClose;
  return (
    <Collapsible
      className={join(foldableClass)}
      trigger={trigger}
      open={open}
      transitionTime={transitionTime} // ms
      onOpen={onOpen}
      onClose={onClose}
    >
      {children}
    </Collapsible>
  );
};

Foldable.propTypes = {
  trigger: PropTypes.any.isRequired,
  children: PropTypes.element.isRequired,
  isOpen: PropTypes.bool,
  transitionTime: PropTypes.number,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
}

export default Foldable;