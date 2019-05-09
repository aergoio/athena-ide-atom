import React from 'react'
import PropTypes from 'prop-types';

import { Card, AddIcon } from '../atoms';
import { CardTitle } from '../molecules';
import { ImportContractModal } from './modals';
import ContractRun from './contract-run';

export const Contract = (props) => {
  const contractAddress2Abi = props.contractAddress2Abi;
  const onAbiExec = props.onAbiExec;
  const onAbiQuery = props.onAbiQuery;
  const onCopyContract = props.onCopyContract;
  const onRemoveContract = props.onRemoveContract;

  let contractRuns = Array.from(contractAddress2Abi.keys()).map(contractAddress => {
    const abi = contractAddress2Abi.get(contractAddress);
    return (
      <ContractRun
        key={contractAddress}
        contractAddress={contractAddress}
        abi={abi}
        onAbiExec={onAbiExec}
        onAbiQuery={onAbiQuery}
        onCopyContract={onCopyContract}
        onRemoveContract={onRemoveContract}
      />
    );
  });

  return (
    <Card>
      <CardTitle title='Contract'>
        <ImportContractModal trigger={<AddIcon />} />
      </CardTitle>
      {contractRuns}
    </Card>
  );
}

Contract.propTypes = {
  contractAddress2Abi: PropTypes.object,
  onAbiExec: PropTypes.func,
  onAbiQuery: PropTypes.func,
  onCopyContract: PropTypes.func,
  onRemoveContract: PropTypes.func,
}

export default Contract;
