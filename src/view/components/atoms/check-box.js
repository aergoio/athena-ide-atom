import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const checkBoxClass = 'component-checkbox';

export default class CheckBox extends React.Component {

  static get propTypes() {
    return {
      text: PropTypes.string,
      onChange: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };

    this._onCheckChange = this._onCheckChange.bind(this);
  }

  get checked() {
    return this.state.checked;
  }

  _onCheckChange(e) {
    this.setState({
      checked: e.target.checked
    });
  }

  render() {
    const text = this.props.text;
    const onChange = (e) => {
      this._onCheckChange(e);
      if (this.props.onChange) {
        this.props.onChange(e);
      }
    }
    const id = uuid();
    return (
      <div>
        <input
          className={checkBoxClass}
          type='checkbox'
          id={id}
          onChange={onChange}
        />
        <label htmlFor={id}>{text}</label>
      </div>
    );
  }

}
