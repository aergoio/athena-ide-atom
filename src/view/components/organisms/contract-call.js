'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { AbiSelect, Abis } from '../molecules';

export const ContractCall = (props) => {
  const currentContract = props.currentContract;
  const contracts = props.contracts;
  const onContractChange = props.onContractChange;
  const currentAbi = props.currentAbi;
  const onAbiCall = props.onAbiCall;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Execute / Query' />
      </Row>
      <AbiSelect currentContract={currentContract} contracts={contracts} onChange={onContractChange} />
      <Abis abi={currentAbi} onAbiCall={onAbiCall} />
    </ComponentsHolder>
  );
}

ContractCall.propTypes = {
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onContractChange: PropTypes.func,
  currentAbi: PropTypes.string,
  onAbiCall: PropTypes.func
}

export default ContractCall;