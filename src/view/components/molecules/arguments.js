import React from 'react'
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { ArgumentRow, Foldable, ArgumentName, InputBox, SelectBox, TextBox } from '../atoms';
import { convertToAerAmountWithUnit, join } from '../../../utils';

const noArgumentsDisplay = "No arguments provided";
const units = [ "aer", "gaer", "aergo" ];

export default class Arguments extends React.Component {

  static get propTypes() {
    return {
      resetState: PropTypes.bool,
      args: PropTypes.array.isRequired,
      payable: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      args: new Array(props.args.length).fill(""),
      amount: "",
      unit: "aer",
    };

    // hack to clean value when reset
    this.inputRefs = []

    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
    this._onUnitChange = this._onUnitChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.args.length !== nextProps.args.length) {
      this.inputRefs.forEach(inputRef => inputRef.current.cleanValue());
      this.setState({
        args: new Array(nextProps.args.length).fill(""),
        amount: "",
        unit: "aer"
      });
    }
  }

  get values() {
    return this.state.args;
  }

  get amount() {
    const amount = "" === this.state.amount ? "0" : this.state.amount;
    return convertToAerAmountWithUnit(amount, this.state.unit);
  }

  _onArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const newArgs = this.state.args.map((oldValue, i) => {
      return index === i ? newValue : oldValue;
    });
    logger.debug("new arguments", index, newValue, newArgs);
    this.setState({ args: newArgs });
  }

  _onAmountChange(e) {
    const newValue = e.target.value;
    this.setState({ amount: newValue.toString() });
  }

  _onUnitChange(target) {
    const newValue = target.value;
    this.setState({ unit: newValue });
  }

  _generateArgsDisplay() {
    let argumentDisplay = noArgumentsDisplay;

    if (this.state.args.map(a => a.trim())
          .filter(a => "" !== a)
          .length > 0) {
      argumentDisplay = "[" + this.state.args.join(", ") + "]";
    }

    return argumentDisplay;
  }

  _generateAmountDisplay() {
    return "" !== this.state.amount ? (this.state.amount + " " + this.state.unit) : "";
  }

  render() {
    this.inputRefs = [];

    const argumentComponents = this.props.args.map((arg, index) => {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);

      return (
        <ArgumentRow key={index}>
          <ArgumentName name={arg} />
          <InputBox
            class='component-inputbox-argument'
            onChange={e => this._onArgumentValueChange(e, index)}
            defaultValue=""
            ref={inputRef}
          />
        </ArgumentRow>
      );
    });

    if (this.props.payable) {
      // hack to clean value when reset
      const inputRef = React.createRef();
      this.inputRefs.push(inputRef);

      argumentComponents.push((
        <ArgumentRow>
          <ArgumentName name="Amount" />
          <InputBox
            type="number"
            class='component-inputbox-argument'
            onChange={this._onAmountChange}
            defaultValue=""
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

    const argumentDisplay = this._generateArgsDisplay();
    const amountDisplay = this._generateAmountDisplay();

    const argumentsTextBoxClass = argumentDisplay === noArgumentsDisplay ?
      join('component-textbox-no-arguments', 'component-textbox-arguments')
      : 'component-textbox-arguments';
    const trigger = (
      <div className='component-arguments-and-amount'>
        <TextBox class={argumentsTextBoxClass} text={argumentDisplay} />
        <TextBox class='component-textbox-amount' text={amountDisplay} />
      </div>
    );

    return (
      <div className='overflow-hidden'>
        <Foldable
          isOpen={false}
          transitionTime={1}
          trigger={trigger}
        >
          {argumentComponents}
        </Foldable>
      </div>
    );
  }

}
