import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Title } from '../atoms';

export const CardTitle = (props) => {
  return (
    <CardRow>
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
