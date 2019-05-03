import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, Title } from '../atoms';
import { FoldableCard, AbiCalls } from '../molecules';

export const ContractCall = (props) => {
  const currentAbi = props.currentAbi;
  const onAbiExec = props.onAbiExec;
  const onAbiQuery = props.onAbiQuery;

  // FIXME : acktsap's hack to refresh input value
  const abiCallsRef = props.abiCallsRef;

  const trigger = (
    <CardRow>
      <Title title='Execute / Query' />
    </CardRow>
  );
  return (
    <FoldableCard trigger={trigger}>
      <AbiCalls abi={currentAbi} onAbiExec={onAbiExec} onAbiQuery={onAbiQuery} ref={abiCallsRef}/>
    </FoldableCard>
  );
}

ContractCall.propTypes = {
  currentAbi: PropTypes.string,
  onAbiExec: PropTypes.func,
  onAbiQuery: PropTypes.func,
  abiCallsRef: PropTypes.any
}

export default ContractCall;
