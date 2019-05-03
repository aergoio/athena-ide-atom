import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const cardClass = 'card';

export const Card = (props) => {
  return (
    <div className={join('inset-panel', cardClass, props.class)}>
      {props.children}
    </div>
  );
};

Card.propTypes = {
  class: PropTypes.class,
  children: PropTypes.element.isRequired
}

export default Card;
