import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

export const CopyIcon = (props) => {
  return (
    <div
      className={join('inline-block', 'icon-clippy', 'component-icon')}
      onClick={props.onClick}>
    </div>
  );
};

CopyIcon.propTypes = {
  onClick: PropTypes.func
};

export default CopyIcon;
