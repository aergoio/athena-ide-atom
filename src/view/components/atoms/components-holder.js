'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const componentsHolderClass = 'components-holder';

export const ComponentsHolder = (props) => {
  return (
    <div className={join('inset-panel', componentsHolderClass)}>
      {props.children}
    </div>
  );
};

ComponentsHolder.propTypes = {
  children: PropTypes.element.isRequired
}

export default ComponentsHolder;