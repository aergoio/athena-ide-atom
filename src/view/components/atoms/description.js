import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const descriptionClass = 'component-description';

export const Description = (props) => {
  return (
    <div className={join('inline-block', descriptionClass)}>
      {props.description}
    </div>
  );
};

Description.propTypes = {
  description: PropTypes.string
}

export default Description;