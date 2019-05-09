import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Title } from '../atoms';

const cardTitleClass = 'card-title';

export const CardTitle = (props) => {
  return (
    <CardRow class={cardTitleClass}>
      <Title title={props.title} class={props.titleClass} />
      {props.children}
    </CardRow>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  titleClass: PropTypes.class,
  children: PropTypes.element,
}

export default CardTitle;
