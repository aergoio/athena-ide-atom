import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

export const TrashIcon = (props) => {
  return (
    <div
      className={join('inline-block', 'icon-trashcan', 'component-icon')}
      onClick={props.onClick}>
    </div>
  );
};

TrashIcon.propTypes = {
  onClick: PropTypes.func
};

export default TrashIcon;
