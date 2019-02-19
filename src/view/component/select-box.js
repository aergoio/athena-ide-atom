'use babel';

import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const selectBoxClass = 'component-selectbox';

export default class SelectBox extends React.Component {

  static get propTypes() { 
    return { 
      context: PropTypes.any,
      value: PropTypes.string,
      options: PropTypes.array,
      onChange: PropTypes.func
    }; 
  }

  constructor(props) {
    super(props);
    this.state = { context: props.context };
    this.onChange = props.onChange.bind(this);
  }

  _join() {
    return Array.from(arguments).join(' ');
  }

  _generateOptions(rawOptions) {
    return rawOptions.map(rawOption => this._generateOption(rawOption));
  }

  _generateOption(option) {
    return {
      value: option,
      label: option
    }
  }

  render() {
    return (
      <Select
        className={this._join('inline-block', selectBoxClass)}
        classNamePrefix={selectBoxClass}
        onChange={this.onChange}
        value={this._generateOption(this.props.value)}
        options={this._generateOptions(this.props.options)}
      />
    );
  }

}