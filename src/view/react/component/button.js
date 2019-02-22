'use babel';

import React from 'react';
import PropTypes from 'prop-types';

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

  _join() {
    return Array.from(arguments).reduce((acc, val) => acc.concat(val), []).join(' ');
  }

  render() {
    return (
      <div className={this._join('btn', 'inline-block', this.props.class)} onClick={this.props.onClick}>
        {this.props.name}
      </div>
    );
  }

}