'use babel';

import React from 'react';
import PropTypes from 'prop-types';

const inputBoxClass = 'component-inputbox';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      placeHolder: PropTypes.string,
      type: PropTypes.string,
      onChange: PropTypes.func
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        className={'inline-block input-text native-key-bindings' + ' ' + inputBoxClass}
        placeHolder={this.props.placeHolder}
        type={this.props.type}
        onChange={this.props.onChange}
      />
    );
  }

}