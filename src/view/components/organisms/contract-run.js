import React from 'react'
import PropTypes from 'prop-types';

import { CardRow, CardItem, Title, CopyIcon, TrashIcon } from '../atoms';
import { ArgumentsAndRunner, FoldableCard } from '../molecules';

const blacklist = [ 'constructor', 'default', 'check_delegation' ];

export default class ContractRun extends React.Component {

  static get propTypes() {
    return {
      contractAddress: PropTypes.string,
      abi: PropTypes.object,
      onAbiExec: PropTypes.func,
      onAbiQuery: PropTypes.func,
      onContractCopy: PropTypes.func,
      onContractRemove: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const contractAddress  = this.props.contractAddress;
    const abi = this.props.abi;
    const abiFunctions = abi.functions;
    const onAbiExec = this.props.onAbiExec;
    const onAbiQuery = this.props.onAbiQuery;
    const onContractCopy = this.props.onContractCopy;
    const onContractRemove = this.props.onContractRemove;

    if (typeof abiFunctions === "undefined") {
      return <div></div>;
    }

    const abiCalls = abiFunctions.filter(f => blacklist.indexOf(f.name) === -1)
      .map((abiFunction, index) => {
        const args = abiFunction.arguments.map(a => a.name);
        const payable = abiFunction.payable;
        const feeDelegatable = abiFunction.feeDelegation;
        const runnerName = abiFunction.name;

        let runner = onAbiExec;
        let gasConsumable = true;
        if (abiFunction.view) {
          gasConsumable = false;
          runner = onAbiQuery;
        }

        return (
          <ArgumentsAndRunner
            key={index}
            args={args}
            gasConsumable={gasConsumable}
            payable={payable}
            feeDelegatable={feeDelegatable}
            runnerName={runnerName}
            runner={(argsRef) => runner(contractAddress, runnerName, argsRef)}
          />
        );
      });

    const trigger = (
      <CardRow>
        <CardItem ratio={1} hideOverflow>
          <Title title={contractAddress} class='component-contract-run-title' />
        </CardItem>
        <CardItem ratio={0}>
          <CopyIcon onClick={(e) => { e.stopPropagation(); onContractCopy(contractAddress)} } />
          <TrashIcon onClick={(e) => { e.stopPropagation(); onContractRemove(contractAddress)} } />
        </CardItem>
      </CardRow>
    );
    return (
      <FoldableCard foldableClass='before-component-foldable' trigger={trigger} transitionTime={1} >
        {abiCalls}
      </FoldableCard>
    )
  }

}
