import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

export const SyncIcon = (props) => {
  return (
    <div
      className={join('inline-block', 'icon-sync', 'component-icon')}
      onClick={props.onClick}>
    </div>
  );
};

SyncIcon.propTypes = {
  onClick: PropTypes.func
};

export default SyncIcon;
