import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const titleClass = 'component-title';

export const Title = (props) => {
  return (
    <div className={join('inline-block', titleClass, props.class)}>
      {props.title}
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  class: PropTypes.class
};

export default Title;
