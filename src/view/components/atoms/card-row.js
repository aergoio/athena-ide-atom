import React from 'react';
import PropTypes from 'prop-types';

const cardRowClass = 'component-card-row';

export const CardRow = (props) => {
  return (
    <div className={[cardRowClass, props.class].join(' ')} style={props.style}>
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
