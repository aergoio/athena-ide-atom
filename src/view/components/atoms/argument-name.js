import React from 'react';
import PropTypes from 'prop-types';

import { join } from '../../../utils';

const argumentNameClass = 'component-argument-name';

export const ArgumentName = (props) => {
  return (
    <div className={join('inline-block', argumentNameClass)}>
      {props.name}
    </div>
  );
};

ArgumentName.propTypes = {
  name: PropTypes.string
}

export default ArgumentName;
