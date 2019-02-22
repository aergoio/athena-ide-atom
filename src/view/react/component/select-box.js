'use babel';

import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';

const selectBoxClass = 'component-selectbox';

export default class SelectBox extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any,
      value: PropTypes.string,
      options: PropTypes.array,
      onChange: PropTypes.func,
      isCreatable: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);
    this.state = { context: props.context };
    if (props.onChange) {
      this.onChange = props.onChange.bind(this);
    }
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
    const ComponentTag = this.props.isCreatable ? CreatableSelect : Select;
    return (
      <ComponentTag
        className={this._join('inline-block', 'native-key-bindings', selectBoxClass)}
        classNamePrefix={selectBoxClass}
        isSearchable={true}
        value={this._generateOption(this.props.value)}
        options={this._generateOptions(this.props.options)}
        onChange={this.onChange}
      />
    );
  }

}