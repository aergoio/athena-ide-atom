'use babel';

import React from 'react';
import PropTypes from 'prop-types';

import {join} from './utils';

const inputBoxClass = 'component-inputbox';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      placeHolder: PropTypes.string,
      value: PropTypes.any,
      type: PropTypes.string,
      class: PropTypes.class,
      onChange: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <input
        className={join('inline-block', 'input-text', 'native-key-bindings', inputBoxClass, this.props.class)}
        value={this.props.value}
        placeHolder={this.props.placeHolder}
        type={this.props.type}
        onChange={(e) => {
          this.setState({ value: e.target.value });
          if (this.props.onChange) {
            this.props.onChange(e);
          }
        }}
      />
    );
  }

}