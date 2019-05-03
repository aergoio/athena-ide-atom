import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const starTitleClass = 'star-title';

export const StarTitle = (props) => {
  return (
    <div className={join(starTitleClass, props.class)}>
      {props.title}
    </div>
  );
};

StarTitle.propTypes = {
  class: PropTypes.class,
  title: PropTypes.string
}

export default StarTitle;
