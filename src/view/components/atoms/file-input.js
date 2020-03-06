import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import logger from 'loglevel';

const fileInputClass = 'component-fileinput';

export default class FileInput extends React.Component {

  static get propTypes() {
    return {
      type: PropTypes.string,
      placeHolder: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      current: undefined
    };
    this._onChange = this._onChange.bind(this);
  }

  get value() {
    return this.state.current;
  }

  _onChange(e) {
    const file = e.target.files[0];
    logger.debug("Current file", file);
    this.setState({
      current: file
    });
  }

  render() {
    const id = uuid();
    const onChange = this._onChange;
    const current = typeof this.state.current === "undefined" ? "" : this.state.current.name;
    logger.debug("current", current);
    return (
      <div className={fileInputClass}>
        <input
          type="file"
          id={id}
          onChange={onChange}
        />
        <label htmlFor={id}>Add File</label>
        <span>{current}</span>
      </div>
    );
  }

}