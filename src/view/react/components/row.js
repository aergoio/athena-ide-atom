'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const rowClass = 'components-row';

export default class Row extends React.Component {

  static get propTypes() {
    return {
      children: PropTypes.element.isRequired,
      class: PropTypes.class
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={join(rowClass, this.props.class)}>
        {this.props.children}
      </div>
    );
  }

}