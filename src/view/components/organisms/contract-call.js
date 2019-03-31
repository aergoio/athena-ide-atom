'use babel'

import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { Abis } from '../molecules';

export const ContractCall = (props) => {
  const currentAbi = props.currentAbi;
  const onAbiCall = props.onAbiCall;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Execute / Query' />
      </Row>
      <Abis abi={currentAbi} onAbiCall={onAbiCall} />
    </ComponentsHolder>
  );
}

ContractCall.propTypes = {
  currentAbi: PropTypes.string,
  onAbiCall: PropTypes.func
}

export default ContractCall;