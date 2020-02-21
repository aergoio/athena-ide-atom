import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

const fileInputClass = 'component-fileinput';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
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
    const onChange = this._onChange;
    return (
      <input
        type="file"
        className={ [fileInputClass, this.props.class].join(' ') }
        ref={this.inputRef}
        onChange={onChange}
      />
    );
  }

}