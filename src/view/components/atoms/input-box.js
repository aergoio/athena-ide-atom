'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const inputBoxClass = 'component-inputbox';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      placeHolder: PropTypes.string,
      value: PropTypes.any,
      type: PropTypes.string,
      inputRef: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        className={join('inline-block', 'input-text', 'native-key-bindings', inputBoxClass, this.props.class)}
        value={this.props.value}
        placeHolder={this.props.placeHolder}
        type={this.props.type}
        ref={this.props.inputRef}
      />
    );
  }

}