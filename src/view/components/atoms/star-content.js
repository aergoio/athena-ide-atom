import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const starContentClass = 'star-content';

export const StarContent = (props) => {
  return (
    <div className={join(starContentClass, props.class)}>
      {props.content}
    </div>
  );
};

StarContent.propTypes = {
  class: PropTypes.class,
  content: PropTypes.string
}

export default StarContent;
