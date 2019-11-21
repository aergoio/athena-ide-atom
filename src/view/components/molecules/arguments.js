import React from 'react'
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { ArgumentRow, Foldable, ArgumentName, InputBox, SelectBox, TextBox, CheckBox } from '../atoms';
import { convertToUnit } from '../../../utils';

const units = [ "aer", "gaer", "aergo" ];

const argumentsTextBoxClass = 'component-textbox-arguments';
const argumentsRowBorderClass = 'argument-row-border';

export default class Arguments extends React.Component {

  static get propTypes() {
    return {
      resetState: PropTypes.bool,
      args: PropTypes.array.isRequired,
      gasConsumable: PropTypes.bool,
      payable: PropTypes.bool,
      feeDelegatable: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      args: new Array(props.args.length).fill(""),
      gasLimit: "",
      amount: "",
      unit: "aer",
      feeDelegation: false
    };

    // hack to clean value when reset
    this.inputRefs = []

    this._onFocusOnAnyInput = this._onFocusOnAnyInput.bind(this);
    this._onBrurOnAnyInput = this._onBrurOnAnyInput.bind(this);
    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onGasLimitChange = this._onGasLimitChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
    this._onUnitChange = this._onUnitChange.bind(this);
    this._onFeeDelegationChange = this._onFeeDelegationChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.args.length !== nextProps.args.length) {
      this.inputRefs.forEach(inputRef => inputRef.current.cleanValue());
      this.setState({
        args: new Array(nextProps.args.length).fill(""),
        gasLimit: "",
        amount: "",
        unit: "aer",
        feeDelegation: false,
      });
    }
  }

  get values() {
    const jsonProcessed = this.state.args.map(rawArg => {
      try {
        // empty -> null
        if ("" === rawArg) {
          return null;
        }
        // process boolean, number, object, array
        const parsed = JSON.parse(rawArg);
        return parsed;
      } catch (error) {
        // otherwise, it is string
        return rawArg;
      }
    });
    return jsonProcessed;
  }

  get gasLimit() {
    return this.state.gasLimit;
  }

  get amount() {
    const amount = "" === this.state.amount ? "0" : this.state.amount;
    const amountInAer = convertToUnit(amount, this.state.unit, 'aer');
    return amountInAer;
  }

  get feeDelegation() {
    return this.state.feeDelegation;
  }

  _onArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const newArgs = this.state.args.map((oldValue, i) => {
      return index === i ? newValue : oldValue;
    });
    logger.debug("new arguments", index, newValue, newArgs);
    this.setState({ args: newArgs });
  }

  _onGasLimitChange(e) {
    const newValue = e.target.value;
    this.setState({ gasLimit: newValue.toString() });
  }

  _onAmountChange(e) {
    const newValue = e.target.value;
    this.setState({ amount: newValue.toString() });
  }

  _onUnitChange(newUnit) {
    this.setState({ unit: newUnit });
  }

  _onFeeDelegationChange(e) {
    const newValue = e.target.checked;
    this.setState({ feeDelegation: newValue });
  }

  _getSummary() {
    const args = this._getArgsSummary();
    const limit = this._getGasLimitSummary();
    const amount = this._getAmountSummary();
    const feeDelegation = this._getFeeDelegationSummary();
    const extraSummary = [ limit, amount, feeDelegation ].filter(v => "" !== v).join(', ');
    return args + ("" !== extraSummary ? ' (' + extraSummary + ')' : "");
  }

  _getArgsSummary() {
    let argumentDisplay = "[]";

    if (this.state.args.map(a => a.trim())
          .filter(a => "" !== a)
          .length > 0) {
      argumentDisplay = "[" + this.state.args.join(", ") + "]";
    }

    return argumentDisplay;
  }

  _getGasLimitSummary() {
    return this.props.gasConsumable && "" !== this.state.gasLimit ?
        ("Limit: " + this.state.gasLimit) : "";
  }

  _getAmountSummary() {
    return this.props.payable && "" !== this.state.amount ?
        ("Amount: " + this.state.amount + " " + this.state.unit) : "";
  }

  _getFeeDelegationSummary() {
    return this.props.feeDelegatable ? "FeeDelegation: " + this.state.feeDelegation : "";
  }

  _onFocusOnAnyInput() {
    if (!this.state.isFocused) {
      this.setState({ isFocused: true });
    }
  }

  _onBrurOnAnyInput() {
    this.setState({ isFocused: false });
  }

  render() {
    // reactive tabindex
    let tabIndex = 1;
    const tabIndexProvider = () => this.state.isFocused ? tabIndex++ : -1;

    this.inputRefs = [];
    const argumentComponents = this.props.args.map((arg, index) => {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);

      return (
        <ArgumentRow key={index}>
          <ArgumentName name={arg} />
          <InputBox
            tabIndex={tabIndexProvider()}
            onFocus={this._onFocusOnAnyInput}
            onBlur={this._onBrurOnAnyInput}
            class='component-inputbox-argument'
            onChange={e => this._onArgumentValueChange(e, index)}
            ref={inputRef}
          />
        </ArgumentRow>
      );
    });

    let optionalAdded = false;

    // (optional) gas limit
    if (this.props.gasConsumable) {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);

      if (!optionalAdded) {
        optionalAdded = true;
        argumentComponents.push(<ArgumentRow class={argumentsRowBorderClass} />);
      }

      argumentComponents.push((
        <ArgumentRow>
          <ArgumentName name="Gas Limit" />
          <InputBox
            tabIndex={tabIndexProvider()}
            type="number"
            class='component-inputbox-argument'
            onChange={this._onGasLimitChange}
            onFocus={this._onFocusOnAnyInput}
            onBlur={this._onBrurOnAnyInput}
            ref={inputRef}
          />
        </ArgumentRow>
      ));
    }

    // (optional) amount
    if (this.props.payable) {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);

      if (!optionalAdded) {
        optionalAdded = true;
        argumentComponents.push(<ArgumentRow class={argumentsRowBorderClass} />);
      }

      argumentComponents.push((
        <ArgumentRow>
          <ArgumentName name="Amount" />
          <InputBox
            tabIndex={tabIndexProvider()}
            type="number"
            class='component-inputbox-argument'
            onChange={this._onAmountChange}
            onFocus={this._onFocusOnAnyInput}
            onBlur={this._onBrurOnAnyInput}
            ref={inputRef}
          />
          <SelectBox
            class='component-selectbox-unit'
            value={this.state.unit}
            options={units}
            onChange={this._onUnitChange}
          />
        </ArgumentRow>
      ));
    }

    // (optional) delegation fee
    if (this.props.feeDelegatable) {
      if (!optionalAdded) {
        optionalAdded = true;
        argumentComponents.push(<ArgumentRow class={argumentsRowBorderClass} />);
      }

      argumentComponents.push((
        <ArgumentRow>
          <CheckBox text="Delegate fee" onChange={this._onFeeDelegationChange} />
        </ArgumentRow>
      ));
    }

    const summary = this._getSummary();
    const trigger = (
      <TextBox class={argumentsTextBoxClass} text={summary} />
    );

    return (
      <Foldable
        isOpen={false}
        transitionTime={1}
        trigger={trigger}
      >
        {argumentComponents}
      </Foldable>
    );
  }

}
