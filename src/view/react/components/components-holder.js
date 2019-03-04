'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const componentsHolderClass = 'components-holder';

export default class ComponentsHolder extends React.Component {

  static get propTypes() {
    return {
      children: PropTypes.element.isRequired
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={join('inset-panel', componentsHolderClass)}>
        {this.props.children}
      </div>
    );
  }

}