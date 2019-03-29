'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

export default class Button extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      onClick: PropTypes.func,
      name: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={join('btn', 'inline-block', this.props.class)} onClick={this.props.onClick}>
        {this.props.name}
      </div>
    );
  }

}