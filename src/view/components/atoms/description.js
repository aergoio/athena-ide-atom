import React from 'react';
import PropTypes from 'prop-types';

const descriptionClass = 'component-description';

export const Description = (props) => {
  return (
    <div className={['inline-block', descriptionClass].join(' ')}>
      {props.description}
    </div>
  );
};

Description.propTypes = {
  description: PropTypes.string
}

export default Description;
