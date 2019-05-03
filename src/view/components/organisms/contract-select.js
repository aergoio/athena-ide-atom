import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Title, Button } from '../atoms';
import { FoldableCard, AbiSelect } from '../molecules';
import { ImportContractModal, RemoveContractModal } from './modals';

export const ContractCall = (props) => {
  const currentContract = props.currentContract;
  const contracts = props.contracts;
  const onContractChange = props.onContractChange;

  const trigger = (
    <CardRow>
      <Title title='Contract' />
    </CardRow>
  );
  return (
    <FoldableCard trigger={trigger}>
      <AbiSelect currentContract={currentContract} contracts={contracts} onChange={onContractChange} />
      <CardRow class='card-row-button'>
        <RemoveContractModal trigger={<Button name='Remove' />} />
        <ImportContractModal trigger={<Button name='Import' class='component-btn-rightmost' />} />
      </CardRow>
    </FoldableCard>
  );
}

ContractCall.propTypes = {
  currentContract: PropTypes.string,
  contracts: PropTypes.array,
  onContractChange: PropTypes.func,
}

export default ContractCall;
