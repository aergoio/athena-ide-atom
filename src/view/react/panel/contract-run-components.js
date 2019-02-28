'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Title, Description, Button, InputBox, SelectBox} from '../component';

export default class ContractRunComponents extends React.Component {

  static get propTypes() {
    return {
      context: PropTypes.any
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      context: props.context
    };

    this.inputRefs = [];
  }

  _parseContractAddress() {
    return this.state.context.current.contract.contractAddress;
  }

  _parseContractAddresses() {
    return Array.from(this.state.context.store.contractAddress2Abi.keys());
  }

  _onContractAddressChange(selectedContractAddress) {
    logger.debug("Contract address change to", selectedContractAddress);
    const context = this.state.context;
    context.current.contract.contractAddress = selectedContractAddress.value;
    this.setState(context);
  }

  _parseAbis() {
    const contractAddress = this._parseContractAddress();
    this.inputRefs = [];
    if (!this.state.context.store.contractAddress2Abi.has(contractAddress)) {
      return <div></div>
    }

    const abi = this.state.context.store.contractAddress2Abi.get(contractAddress);
    logger.debug("Current Abi", abi);
    return abi.functions.map((abiFunction, index) => {
      return (
        <div className='components-row' key={index}>
          <Button
            name={abiFunction.name}
            class={['component-btn-runner', 'component-description', 'component-btn-execute']}
            onClick={() => this._contractFunctionClicked(index, abiFunction.name, contractAddress, abi)}
          />
          <InputBox type='text' class='component-inputbox-text'
            ref={this._createNewRef(index)}
            placeHolder={this._parseArgumentsPlaceholder(abiFunction.arguments)}
          />
        </div>
      );
    });
  }

  _contractFunctionClicked(index, targetFunction, contractAddress, abi) {
    const ref = this.inputRefs[index].current;
    logger.debug("Input ref:", ref);
    const targetArgs = ref.state.value.split(',').map(arg => arg.trim()).map(arg => {
      const asNumber = Number(arg);
      return Number.isNaN(asNumber) ? arg.replace(/\\"/g, '') : asNumber;
    });
    logger.debug("Contract function execution clicked with", index, targetFunction, targetArgs,
                  contractAddress, abi);

    const accountAddress = this.state.context.current.account.accountAddress;
    const price = this.state.context.current.fee.price;
    const limit = this.state.context.current.fee.limit;
    logger.debug("Account:", accountAddress, ", fee:", price, limit);

    this.state.context.services.contractService.execute(accountAddress, price, limit,
          targetFunction, targetArgs, contractAddress, abi);
  }

  _createNewRef(index) {
    const newRef = React.createRef();
    this.inputRefs[index] = newRef;
    return newRef;
  }

  _parseArgumentsPlaceholder(args) {
    return args.length === 0 ? "No argument" : args.map(arg => arg.name).join(", ");
  }

  render() {
    return (
      <div className='inset-panel components-holder'>
        <div className='components-row'>
          <Title title='Execute / Query' />
        </div>
        <div className='components-row'>
          <Description description='ABI' />
          <SelectBox
            value={this._parseContractAddress()}
            options={this._parseContractAddresses()}
            onChange={(o) => this._onContractAddressChange(o)}
          />
        </div>
        {
          this._parseAbis()
        }
      </div>
   );
  }

}
