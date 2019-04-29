import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title, Button } from '../atoms';
import { AbiSelect } from '../molecules';
import { ImportContractModal, RemoveContractModal } from './modals';

export const ContractCall = (props) => {
  const currentContract = props.currentContract;
  const contracts = props.contracts;
  const onContractChange = props.onContractChange;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Contract' />
      </Row>
      <AbiSelect currentContract={currentContract} contracts={contracts} onChange={onContractChange} />
      <Row class='components-row-button'>
        <ImportContractModal trigger={<Button name='Import' />} />
        <RemoveContractModal trigger={<Button name='Remove' />} />
      </Row>
    </ComponentsHolder>
  );
}

ContractCall.propTypes = {
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onContractChange: PropTypes.func,
}

export default ContractCall;