import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const checkBoxClass = 'component-checkbox';

export default class CheckBox extends React.Component {

  static get propTypes() {
    return {
      text: PropTypes.string,
      checked: PropTypes.boolean,
      onChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    // not used yet
    this.inputRef = React.createRef();
  }

  render() {
    const text = this.props.text;
    const checked = this.props.checked;
    const onChange = this.props.onChange;
    const id = uuid();
    return (
      <div>
        <input
          ref={this.inputRef}
          className={checkBoxClass}
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
        />
        <label htmlFor={id}>{text}</label>
      </div>
    );
  }

}
