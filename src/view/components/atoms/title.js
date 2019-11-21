import React from 'react';
import PropTypes from 'prop-types';

const titleClass = 'component-title';

export const Title = (props) => {
  return (
    <div className={['inline-block', titleClass, props.class].join(' ')}>
      {props.title}
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  class: PropTypes.class
};

export default Title;
