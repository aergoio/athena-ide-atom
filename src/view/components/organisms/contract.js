import React from 'react'
import { Flex } from 'reflexbox';
import PropTypes from 'prop-types';

import { Card, CardRow, Description, InputBox, Button } from '../atoms';
import { CardTitle } from '../molecules';
import ContractRun from './contract-run';

export const Contract = (props) => {
  const onContractImport = props.onContractImport;
  const onContractCopy = props.onContractCopy;
  const onContractRemove = props.onContractRemove;
  const contractAddress2Abi = props.contractAddress2Abi;
  const onAbiExec = props.onAbiExec;
  const onAbiQuery = props.onAbiQuery;

  let border;
  if (contractAddress2Abi.size !== 0) {
    border = <CardRow class='card-row-border' />
  }

  // reverse to display recent elememt first
  let contractRuns = Array.from(contractAddress2Abi.keys()).reverse().map(contractAddress => {
    const abi = contractAddress2Abi.get(contractAddress);
    return (
      <ContractRun
        key={contractAddress}
        contractAddress={contractAddress}
        abi={abi}
        onAbiExec={onAbiExec}
        onAbiQuery={onAbiQuery}
        onContractCopy={onContractCopy}
        onContractRemove={onContractRemove}
      />
    );
  });

  const contractInputRef = React.createRef();
  return (
    <Card>
      <CardTitle title='Contract' />
      <CardRow>
        <Description description='Contract' />
        <InputBox ref={contractInputRef} type='text'
            placeHolder='eg. Amg6TQrTd6f7dE67PBzv6vbVDnxpEnzKpRfRbV46NNNDhjqmdk77'/>
      </CardRow>
      <CardRow>
        <Flex justify='flex-end' w={1}>
          <Button name='Import' class='component-btn-ocean' onClick={() => onContractImport(contractInputRef) } />
        </Flex>
      </CardRow>
      {border}
      {contractRuns}
    </Card>
  );
}

Contract.propTypes = {
  onContractImport: PropTypes.func,
  onContractCopy: PropTypes.func,
  onContractRemove: PropTypes.func,
  contractAddress2Abi: PropTypes.object,
  onAbiExec: PropTypes.func,
  onAbiQuery: PropTypes.func,
}

export default Contract;
