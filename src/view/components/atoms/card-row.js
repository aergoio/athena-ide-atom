import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const cardRowClass = 'component-card-row';

export const CardRow = (props) => {
  return (
    <div className={join(cardRowClass, props.class)} style={props.style}>
      {props.children}
    </div>
  );
};

CardRow.propTypes = {
  children: PropTypes.element.isRequired,
  class: PropTypes.class,
  style: PropTypes.object
};

export default CardRow;
