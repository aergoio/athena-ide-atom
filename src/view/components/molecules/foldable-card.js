import React from 'react'
import PropTypes from 'prop-types';
import { Card, Foldable } from '../atoms';

export const FoldableCard = (props) => {
  return (
    <Card>
      <Foldable trigger={props.trigger}>
        {props.children}
      </Foldable>
    </Card>
  );
};

FoldableCard.propTypes = {
  trigger: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired
}

export default FoldableCard;
