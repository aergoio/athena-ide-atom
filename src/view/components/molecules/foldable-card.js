import React from 'react'
import PropTypes from 'prop-types';
import { Card, Foldable } from '../atoms';

export const FoldableCard = (props) => {
  return (
    <Card class={props.class}>
      <Foldable trigger={props.trigger} isOpen={props.isOpen} transitionTime={props.transitionTime}>
        {props.children}
      </Foldable>
    </Card>
  );
};

FoldableCard.propTypes = {
  class: PropTypes.class,
  trigger: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
  isOpen: PropTypes.bool,
  transitionTime: PropTypes.number,
}

export default FoldableCard;
