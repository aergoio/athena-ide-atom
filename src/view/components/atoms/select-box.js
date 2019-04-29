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

  _generateOption(option) {
    return {
      value: option,
      label: option
    }
  }

  render() {
    const SelectBoxComponent = this.props.isCreatable ? CreatableSelect : Select;
    const option = this._generateOption(this.props.value);
    const options = this.props.options.map(o => this._generateOption(o));
    return (
      <SelectBoxComponent
        className={join('inline-block', 'native-key-bindings', selectBoxClass)}
        classNamePrefix={selectBoxClass}
        value={option}
        options={options}
        onChange={this.props.onChange}
      />
    );
  }

}