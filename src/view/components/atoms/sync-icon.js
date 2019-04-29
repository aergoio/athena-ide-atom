import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const syncIconClass = 'component-icon';

export const SyncIcon = (props) => {
  return (
    <div
      className={join('inline-block', 'icon-sync', syncIconClass)}
      onClick={props.onClick}>
    </div>
  );
};

SyncIcon.propTypes = {
  onClick: PropTypes.func
};

export default SyncIcon;