import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Button, InputBox, CopyIcon, TrashIcon } from '../atoms';
import { CardTitle, FoldableCard } from '../molecules';

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

    // FIXME : acktsap's hack to refresh input value
    this.argsRefs = [];
  }

  cleanArgsValue() {
    this.argsRefs.forEach(r => {
      if (r.current) {
        r.current.cleanValue()
      }
    });
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

    this.argsRefs = [];

    const abiCalls = abiFunctions.filter(f => "constructor" !== f.name)
      .map((abiFunction, index) => {
        const argsRef = React.createRef();
        this.argsRefs.push(argsRef);

        const args = abiFunction.arguments;
        const inputPlaceHolder = args.length === 0 ? "No argument" : args.map(a => a.name).join(", ");

        let buttonStyle = 'component-btn-transaction';
        let callback = onAbiExec;
        if (abiFunction.view) {
          buttonStyle = '';
          callback = onAbiQuery;
        }
        return (
          <CardRow key={index} >
            <InputBox type='text'
              ref={argsRef}
              defaultValue=""
              placeHolder={inputPlaceHolder}
            />
            <Button
              name={abiFunction.name}
              class={buttonStyle}
              onClick={() => callback(contractAddress, abi, abiFunction.name, argsRef)}
            />
          </CardRow>
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
