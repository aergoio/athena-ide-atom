import React from 'react'
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {
  ArgumentRow, Foldable, ArgumentName, InputBox,
  SelectBox, TextBox, CheckBox, Button,
} from '../atoms';
import { convertToUnit } from '../../../utils';

const VARARG = "...";
const VARARG_PREVIX = "arg_";
const UNITS = [ "aer", "gaer", "aergo" ];

const argumentsTextBoxClass = 'component-textbox-arguments';
const argumentsRowBorderClass = 'argument-row-border';

// FIXME: Too big.. need refactor
export default class Arguments extends React.Component {

  static get propTypes() {
    return {
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
      args: [],
      varArgs: [],
      gasLimit: "",
      amount: "",
      unit: "aer",
      feeDelegation: false
    };

    // hack to clean value when reset
    this.inputRefs = new Set();

    // common
    this._onFocusOnAnyInput = this._onFocusOnAnyInput.bind(this);
    this._onBrurOnAnyInput = this._onBrurOnAnyInput.bind(this);

    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onVarArgumentValueChange = this._onVarArgumentValueChange.bind(this);
    this._onVarArgRemove = this._onVarArgRemove.bind(this);
    this._onVarArgAdd = this._onVarArgAdd.bind(this);

    this._onGasLimitChange = this._onGasLimitChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
    this._onUnitChange = this._onUnitChange.bind(this);
    this._onFeeDelegationChange = this._onFeeDelegationChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this._isStateDifferent(this.props, nextProps)) {
      // reset input values
      logger.debug("clean inputrefs", this.inputRefs);
      this.inputRefs.forEach(inputRef => inputRef.current.cleanValue());

      this.setState({
        args: [],
        varArgs: [],
        gasLimit: "",
        amount: "",
        unit: "aer",
        feeDelegation: false,
      });
    }
  }

  _isStateDifferent(preProps, nextProps) {
    return preProps.args.length !== nextProps.args.length ||
            preProps.gasConsumable !== nextProps.gasConsumable ||
            preProps.payable !== nextProps.payable ||
            preProps.feeDelegatable !== nextProps.feeDelegatable;
  }

  get values() {
    const args = this.state.args;
    const varArgs = this.state.varArgs;
    const totalArgs = args.concat(varArgs);
    const jsonProcessed = totalArgs.map(rawArg => {
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
    return "" !== this.state.gasLimit ? this.state.gasLimit : "0";
  }

  get amount() {
    const amount = "" === this.state.amount ? "0" : this.state.amount;
    const amountInAer = convertToUnit(amount, this.state.unit, 'aer');
    return amountInAer;
  }

  get feeDelegation() {
    return this.state.feeDelegation;
  }

  render() {
    // clean references
    this.inputRefs.clear();

    // reactive tabindex
    let tabIndex = 1;
    const tabIndexProvider = () => this.state.isFocused ? tabIndex++ : -1;

    let components = []

    // arguments
    logger.debug("args", this.props.args);
    this.props.args.filter(a => a !== VARARG)
        .forEach((a, i) => {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.add(inputRef);

      const value = this.state.args[i];
      components.push(
        <Argument
          key={i}
          name={a}
          value={value}
          tabIndex={tabIndexProvider()}
          onChange={e => this._onArgumentValueChange(e, i)}
          onFocus={this._onFocusOnAnyInput}
          onBlur={this._onBrurOnAnyInput}
          inputRef={inputRef}
        />
      );
    });

    // existing varargs
    logger.debug("varArgs", this.state.varArgs);
    this.state.varArgs.forEach((a, i) => {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.add(inputRef);

      const name = `${VARARG_PREVIX}${i + 1}`
      const value = this.state.varArgs[i];
      components.push((
        <VarArgument
          key={i}
          name={name}
          value={value}
          tabIndex={tabIndexProvider()}
          onChange={e => this._onVarArgumentValueChange(e, i)}
          onFocus={this._onFocusOnAnyInput}
          onBlur={this._onBrurOnAnyInput}
          inputRef={inputRef}
          onVarArgRemove={() => this._onVarArgRemove(inputRef, i)}
        />
      ));
    });

    // additional varargs
    const isVarArg = (this.props.args.length !== 0) &&
        (this.props.args[this.props.args.length - 1] === VARARG);
    if (isVarArg) {
      const name = `${VARARG_PREVIX}${this.state.varArgs.length + 1}`
      components.push((
        <OptionalVarArgument
          name={name}
          onVarArgAdd={this._onVarArgAdd}
        />
      ));
    }

    // additional
    const gasConsumable = this.props.gasConsumable;
    const payable = this.props.payable;
    const feeDelegatable = this.props.feeDelegatable;

    // add border
    const additional = gasConsumable && payable && feeDelegatable;
    if (additional) {
      components.push(<ArgumentRow class={argumentsRowBorderClass} />);
    }

    // (optional) gas limit
    if (gasConsumable) {
      const inputRef = React.createRef();
      this.inputRefs.add(inputRef);

      const value = this.state.gasLimit
      components.push((
        <GasLimit
          value={value}
          tabIndex={tabIndexProvider()}
          onChange={this._onGasLimitChange}
          onFocus={this._onFocusOnAnyInput}
          onBlur={this._onBrurOnAnyInput}
          inputRef={inputRef}
        />
      ));
    }

    // (optional) amount
    if (payable) {
      const inputRef = React.createRef();
      this.inputRefs.add(inputRef);

      const value = this.state.amount;
      components.push((
        <Amount
          value={value}
          tabIndex={tabIndexProvider()}
          onAmountChange={this._onAmountChange}
          onFocus={this._onFocusOnAnyInput}
          onBlur={this._onBrurOnAnyInput}
          ref={inputRef}
          unitValue={this.state.unit}
          unitOptions={UNITS}
          onUnitChange={this._onUnitChange}
        />
      ));
    }

    // (optional) delegation fee
    if (feeDelegatable) {
      components.push((
        <DelegateFee
          checked={this.state.feeDelegation}
          onChange={this._onFeeDelegationChange}
        />
      ));
    }

    // summary
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
        {components}
      </Foldable>
    );
  }

  _onArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const args = this.state.args;
    args[index] = newValue;
    this.setState({ args: args });
  }

  _onVarArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const varArgs = this.state.varArgs;
    varArgs[index] = newValue;
    this.setState({ varArgs: varArgs });
  }

  _onVarArgRemove(inputRef, index) {
    logger.info("Remove var args");

    // clean displayed value
    inputRef.current.cleanValue();
    this.inputRefs.delete(inputRef);

    // clean saved value
    const newVarArgs = this.state.varArgs;
    newVarArgs.splice(index, 1);
    logger.debug("New var args", newVarArgs);
    this.setState({ varArgs: newVarArgs });
  }

  _onVarArgAdd() {
    logger.info("Add var args");
    const newVarArgs = this.state.varArgs;
    newVarArgs.push("");
    logger.debug("New var args", newVarArgs);
    this.setState({ varArgs: newVarArgs });
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
    const args = this.state.args;
    const varArgs = this.state.varArgs;
    logger.debug("Display args", args, "varargs", varArgs);
    const display = args.concat(varArgs)
          .filter(a => "" !== a)
          .join(", ");
    return `[${display}]`;
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

}


// components

const Argument = (props) => {
  const name = props.name;
  const value = props.value;
  const tabIndex = props.tabIndex;
  const onChange = props.onChange;
  const onFocus = props.onFocus;
  const onBlur = props.onBlur;
  const inputRef = props.inputRef;
  return (
    <ArgumentRow>
      <ArgumentName name={name} />
      <InputBox
        class='component-inputbox-argument'
        value={value}
        tabIndex={tabIndex}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
      />
      <div className='component-argument-right-margin' ></div>
    </ArgumentRow>
  );
}

Argument.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputRef: PropTypes.any,
}

const VarArgument = (props) => {
  const name = props.name;
  const value = props.value;
  const tabIndex = props.tabIndex;
  const onChange = props.onChange;
  const onFocus = props.onFocus;
  const onBlur = props.onBlur;
  const inputRef = props.inputRef;
  const onClick = props.onVarArgRemove;
  return (
    <ArgumentRow>
      <ArgumentName name={name} />
      <InputBox
        class='component-inputbox-argument'
        value={value}
        tabIndex={tabIndex}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
      />
      <Button
        class='component-btn-negative'
        onClick={onClick}
        name='-'
      />
    </ArgumentRow>
  );
}

VarArgument.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputRef: PropTypes.any,
  onVarArgRemove: PropTypes.func,
}

const OptionalVarArgument = (props) => {
  const name = props.name;
  const onClick = props.onVarArgAdd;
  return (
    <ArgumentRow>
      <ArgumentName name={name} />
      <InputBox
        class='component-inputbox-argument'
        placeHolder='Optional'
        disabled
      />
      <Button
        class='component-btn-positive'
        onClick={onClick}
        name='+'
       />
    </ArgumentRow>
  );
}

OptionalVarArgument.propTypes = {
  name: PropTypes.string,
  onVarArgAdd: PropTypes.func,
}

const GasLimit = (props) => {
  const value = props.value;
  const tabIndex = props.tabIndex;
  const onChange = props.onChange;
  const onFocus = props.onFocus;
  const onBlur = props.onBlur;
  const inputRef = props.inputRef;
  return (
    <ArgumentRow>
      <ArgumentName name="Gas Limit" />
      <InputBox
        type="number"
        class='component-inputbox-argument'
        placeHolder='(default: 0)'
        value={value}
        tabIndex={tabIndex}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
      />
    </ArgumentRow>
  );
}

GasLimit.propTypes = {
  value: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputRef: PropTypes.any,
}

const Amount = (props) => {
  const value = props.value;
  const tabIndex = props.tabIndex;
  const onAmountChange = props.onAmountChange;
  const onFocus = props.onFocus;
  const onBlur = props.onBlur;
  const inputRef = props.inputRef;

  const unitValue = props.unitValue;
  const unitOptions = props.unitOptions;
  const onUnitChange = props.onUnitChange;

  return (
    <ArgumentRow>
      <ArgumentName name="Amount" />
      <InputBox
        value={value}
        tabIndex={tabIndex}
        type="number"
        class='component-inputbox-argument'
        onChange={onAmountChange}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
      />
      <SelectBox
        class='component-selectbox-unit'
        value={unitValue}
        options={unitOptions}
        onChange={onUnitChange}
      />
    </ArgumentRow>
  );
}

Amount.propTypes = {
  value: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  onAmountChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputRef: PropTypes.any,

  unitValue: PropTypes.string,
  unitOptions: PropTypes.array,
  onUnitChange: PropTypes.func,
}

const DelegateFee = (props) => {
  const checked = props.checked;
  const onChange = props.onChange;
  return (
    <ArgumentRow>
      <CheckBox text="Delegate fee"
        checked={checked}
        onChange={onChange}
      />
    </ArgumentRow>
  );
}

DelegateFee.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
}