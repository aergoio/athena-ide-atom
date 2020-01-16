import React from 'react';
import PropTypes from 'prop-types';

const inputBoxClass = 'component-inputbox';
const inputBoxNumberClass = 'component-inputbox-number';

export default class InputBox extends React.Component {

  static get propTypes() {
    return {
      class: PropTypes.class,
      tabIndex: PropTypes.number,
      type: PropTypes.string,
      placeHolder: PropTypes.string,
      value: PropTypes.any,
      defaultValue: PropTypes.any,
      disabled: PropTypes.boolean,
      onChange: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  get value() {
    return this.inputRef.current.value;
  }

  cleanValue() {
    this.inputRef.current.value = "";
  }

  render() {
    const injectedClass = this.props.class;
    const tabIndex = typeof this.props.tabIndex === "undefined" ? -1 : this.props.tabIndex;
    const type = this.props.type;
    const placeHolder = this.props.placeHolder;
    const value = this.props.value
    const defaultValue = typeof this.props.defaultValue === "undefined" ? "" : this.props.defaultValue;
    const disabled = typeof this.props.disabled === "undefined" ? false : this.props.disabled;
    const onChange = this.props.onChange;
    const onFocus = this.props.onFocus;
    const onBlur = this.props.onBlur;

    const numberTypeClass = this.props.type === "number" ? inputBoxNumberClass : "";
    const inputRef = this.inputRef;
    let ret;
    if (typeof value !== "undefined") {
      ret = (
        <input
          className={['inline-block', 'native-key-bindings',
              inputBoxClass, numberTypeClass, injectedClass].join(' ')}
          tabIndex={tabIndex}
          type={type}
          placeHolder={placeHolder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
        />
      );
    } else {
      ret = (
        <input
          className={['inline-block', 'native-key-bindings',
              inputBoxClass, numberTypeClass, injectedClass].join(' ')}
          tabIndex={tabIndex}
          type={type}
          placeHolder={placeHolder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
        />
      );
    }
    return ret;
  }

}
