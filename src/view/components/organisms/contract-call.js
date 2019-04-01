'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { AbiCalls } from '../molecules';

export const ContractCall = (props) => {
  const currentAbi = props.currentAbi;
  const onAbiCall = props.onAbiCall;

  // FIXME : acktsap's hack to refresh input value
  const abiCallsRef = props.abiCallsRef;

  return (
    <ComponentsHolder>
      <Row>
        <Title title='Execute / Query' />
      </Row>
      <AbiCalls abi={currentAbi} onAbiCall={onAbiCall} ref={abiCallsRef}/>
    </ComponentsHolder>
  );
}

ContractCall.propTypes = {
  currentAbi: PropTypes.string,
  onAbiCall: PropTypes.func,
  abiCallsRef: PropTypes.any
}

export default ContractCall;