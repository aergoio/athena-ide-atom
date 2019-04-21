'use babel';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import { Panel } from '../atoms';
import { Environment, ContractSelect, ContractCall } from '../organisms';

import { parseArgs, runCallback } from './utils';

@inject('notificationStore', 'contractStore')
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
    this._onAbiExec = this._onAbiExec.bind(this);
    this._onAbiQuery = this._onAbiQuery.bind(this);

    // FIXME : acktsap's hack to refresh input value
    this.abiCallsRef = React.createRef();
  }

  _onContractAddressChange(selectedContractAddress) {
    runCallback.call(this, () => {
      this.abiCallsRef.current.cleanArgsValue();
      const contractAddress = selectedContractAddress.value;
      logger.info("Contract address change to", contractAddress);
      this.props.contractStore.changeContract(contractAddress);
    });
  }

  _onAbiExec(argInputRef, targetFunction) {
    runCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Execute contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.executeContract(targetFunction, targetArgs);
    })
  }

  _onAbiQuery(argInputRef, targetFunction) {
    runCallback.call(this, () => {
      logger.debug("Input ref:", argInputRef);
      const targetArgs = parseArgs(argInputRef.current.value);
      logger.info("Query contract", targetFunction, "with args", targetArgs);
      this.props.contractStore.queryContract(targetFunction, targetArgs);
    });
  }

  render() {
    // contract select
    const onContractChange = this._onContractAddressChange;
    const currentContract = this.props.contractStore.currentContract;
    const contracts = this.props.contractStore.contracts;

    // execute / query
    const currentAbi = this.props.contractStore.currentAbi;
    const onAbiExec = this._onAbiExec;
    const onAbiQuery = this._onAbiQuery;

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
          onAbiExec={onAbiExec}
          onAbiQuery={onAbiQuery}
          abiCallsRef={this.abiCallsRef}
        />
      </Panel>
    );
  }

}