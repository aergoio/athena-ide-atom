import React from 'react';
import PropTypes from 'prop-types';

import {join} from '../../../utils';

const inputBoxClass = 'component-inputbox';
const inputBoxNumberClass = 'component-inputbox-number';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      onChange: PropTypes.func,
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

  render() {
    const numberTypeClass = this.props.type === "number" ? inputBoxNumberClass : "";
    return (
      <input
        className={join('inline-block', 'input-text', 'native-key-bindings',
          inputBoxClass, numberTypeClass, this.props.class)}
        tabIndex={-1}
        onChange={this.props.onChange}
        placeHolder={this.props.placeHolder}
        type={this.props.type}
        ref={this.inputRef}
      />
    );
  }

}
