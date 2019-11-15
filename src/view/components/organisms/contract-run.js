import React from 'react'
import PropTypes from 'prop-types';
import { CopyIcon, TrashIcon } from '../atoms';
import { CardTitle, ArgumentsAndRunner, FoldableCard } from '../molecules';

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

    const abiCalls = abiFunctions.filter(f => "constructor" !== f.name)
      .map((abiFunction, index) => {
        const args = abiFunction.arguments.map(a => a.name);
        const payable = abiFunction.payable;
        // TODO: force delegateable
        // const feeDelegation = abiFunction.feeDelegation;
        const feeDelegation = true;

        const runnerName = abiFunction.name;
        let runnerStyle = 'component-btn-transaction';
        let runner = onAbiExec;
        if (abiFunction.view) {
          runnerStyle = '';
          runner = onAbiQuery;
        }

        return (
          <ArgumentsAndRunner
            key={index}
            args={args}
            payable={payable}
            feeDelegation={feeDelegation}
            runnerName={runnerName}
            runnerStyle={runnerStyle}
            runner={(argsRef, delegateFeeRef) => runner(contractAddress, runnerName, argsRef, delegateFeeRef)}
          />
        );
      });

    const trigger = (
      <CardTitle title={contractAddress} titleClass='component-contract-run-title'>
        <CopyIcon onClick={(e) => { e.stopPropagation(); onContractCopy(contractAddress)} } />
        <TrashIcon onClick={(e) => { e.stopPropagation(); onContractRemove(contractAddress)} } />
      </CardTitle>
    );
    return (
      <FoldableCard foldableClass='before-component-foldable' trigger={trigger} transitionTime={1} >
        {abiCalls}
      </FoldableCard>
    )
  }

}
