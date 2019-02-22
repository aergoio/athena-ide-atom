'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const testBoxClass = 'component-textbox';

export default class TextBox extends React.Component {

  static get propTypes() {
    return {
      text: PropTypes.string,
      class: PropTypes.class
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
      <div className={this._join('inline-block', testBoxClass, this.props.class)}>
        {this.props.text}
      </div>
    );
  }

}