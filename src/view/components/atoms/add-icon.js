import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

export const AddIcon = (props) => {
  return (
    <div
      className={join('inline-block', 'icon-diff-added', 'component-icon')}
      onClick={props.onClick}>
    </div>
  );
};

AddIcon.propTypes = {
  onClick: PropTypes.func
};

export default AddIcon;
