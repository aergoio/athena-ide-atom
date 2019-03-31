'use babel';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Environment, ContractSelect, ContractCall } from '../organisms';

import { parseArgs } from './utils';

@inject('contractStore')
@observer
export default class RunPanel extends React.Component {

  static get propTypes() {
    return {
      contractStore: PropTypes.any
    };
  }

  constructor(props) {
    super(props);

    this._onContractAddressChange = this._onContractAddressChange.bind(this);
    this._onContractFunctionClicked = this._onContractFunctionClicked.bind(this);
  }

  _onContractAddressChange(selectedContractAddress) {
    const contractAddress = selectedContractAddress.value;
    logger.info("Contract address change to", contractAddress);
    this.props.contractStore.changeContract(contractAddress);
  }

  _onContractFunctionClicked(argInputRef, targetFunction) {
    logger.debug("Input ref:", argInputRef);
    const targetArgs = parseArgs(argInputRef.current.value);
    logger.info("Execute contract", targetFunction, "with args", targetArgs);
    this.props.contractStore.executeContract(targetFunction, targetArgs);
  }

  render() {
    // contract select
    const onContractChange = this._onContractAddressChange;
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;

    // execute / query
    const currentAbi = this.props.contractStore.currentAbi;
    const onAbiCall = this._onContractFunctionClicked;

    return (
      <Panel>
        <Environment />
        <ContractSelect
          onContractChange={onContractChange}
          currentContract={currentContract}
          contracts={contracts}
        />
        <ContractCall
          currentAbi={currentAbi}
          onAbiCall={onAbiCall}
        />
      </Panel>
    );
  }

}