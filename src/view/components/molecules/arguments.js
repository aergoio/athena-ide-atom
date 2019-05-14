import React from 'react'
import PropTypes from 'prop-types';
import logger from 'loglevel';
import { ArgumentRow, Foldable, ArgumentName, InputBox, TextBox } from '../atoms';

export default class Arguments extends React.Component {

  static get propTypes() {
    return {
      payable: PropTypes.bool,
      args: PropTypes.array.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      args: new Array(props.args.length).fill(""),
      amount: ""
    };

    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
  }

  get values() {
    return this.state.args;
  }

  get amount() {
    return this.state.amount;
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

  _generateArgsDisplay() {
    let argumentDisplay = "No arguments provided";

    if (this.state.args.map(a => a.trim())
          .filter(a => "" !== a)
          .length > 0) {
      argumentDisplay = "[" + this.state.args.join(", ") + "]";
    }

    if ("" !== this.state.amount) {
      argumentDisplay += (" (amount: " + this.state.amount + ")");
    }

    return argumentDisplay;
  }

  render() {
    const argumentDisplay = this._generateArgsDisplay();

    const argumentComponents = this.props.args.map((arg, index) => {
      return (
        <ArgumentRow key={index}>
          <ArgumentName name={arg} />
          <InputBox
            onChange={e => this._onArgumentValueChange(e, index)}
            defaultValue=""
          />
        </ArgumentRow>
      );
    });

    if (this.props.payable) {
      argumentComponents.push((
        <ArgumentRow>
          <ArgumentName name="Amount" />
          <InputBox
            onChange={this._onAmountChange}
            defaultValue=""
          />
        </ArgumentRow>
      ));
    }

    return (
      <Foldable
        isOpen={false}
        triggerBaseClass='smile-foldable'
        transitionTime={1}
        trigger={<TextBox class='component-textbox-arguments' text={argumentDisplay} />}
      >
        {argumentComponents}
      </Foldable>
    );
  }

}
