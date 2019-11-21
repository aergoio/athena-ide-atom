import React from 'react';
import PropTypes from 'prop-types';

const argumentNameClass = 'component-argument-name';

export const ArgumentName = (props) => {
  return (
    <div className={['inline-block', argumentNameClass].join(' ')}>
      {props.name}
    </div>
  );
};

ArgumentName.propTypes = {
  name: PropTypes.string
}

export default ArgumentName;
