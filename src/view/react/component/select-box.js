'use babel';

import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';

import {join} from './utils';

const selectBoxClass = 'component-selectbox';

export default class SelectBox extends React.Component {

  static get propTypes() {
    return {
      value: PropTypes.string,
      options: PropTypes.array,
      onChange: PropTypes.func,
      isCreatable: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);
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
        className={join('inline-block', 'native-key-bindings', selectBoxClass)}
        classNamePrefix={selectBoxClass}
        value={this._generateOption(this.props.value)}
        options={this._generateOptions(this.props.options)}
        onChange={this.props.onChange}
      />
    );
  }

}