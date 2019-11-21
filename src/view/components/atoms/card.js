import React from 'react';
import PropTypes from 'prop-types';

const cardClass = 'card';

export const Card = (props) => {
  return (
    <div className={['inset-panel', cardClass, props.class].join(' ')}>
      {props.children}
    </div>
  );
};

Card.propTypes = {
  class: PropTypes.class,
  children: PropTypes.element.isRequired
}

export default Card;
