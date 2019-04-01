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
      type: PropTypes.string
    };
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  get value() {
    return this.inputRef.current.value;
  }

  cleanValue() {
    this.inputRef.current.value = "";
  }

  render() {
    return (
      <input
        className={join('inline-block', 'input-text', 'native-key-bindings', inputBoxClass, this.props.class)}
        placeHolder={this.props.placeHolder}
        type={this.props.type}
        ref={this.inputRef}
      />
    );
  }

}