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
      onCopyContract: PropTypes.func,
      onRemoveContract: PropTypes.func,
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
    const onCopyContract = this.props.onCopyContract;
    const onRemoveContract = this.props.onRemoveContract;

    if (typeof abiFunctions === "undefined") {
      return <div></div>;
    }

    const abiCalls = abiFunctions.filter(f => "constructor" !== f.name)
      .map((abiFunction, index) => {
        const args = abiFunction.arguments.map(a => a.name);
        const payable = abiFunction.payable;

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
            runnerName={runnerName}
            runnerStyle={runnerStyle}
            runner={argsRef => runner(contractAddress, abi, runnerName, argsRef)}
          />
        );
      });

    const trigger = (
      <CardTitle title={contractAddress} titleClass='component-inner-title'>
        <CopyIcon onClick={(e) => { e.stopPropagation(); onCopyContract(contractAddress)} } />
        <TrashIcon onClick={(e) => { e.stopPropagation(); onRemoveContract(contractAddress)} } />
      </CardTitle>
    );
    return (
      <FoldableCard class='inner-card' trigger={trigger} transitionTime={1} >
        {abiCalls}
      </FoldableCard>
    )
  }

}
