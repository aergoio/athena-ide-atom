import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Button } from '../atoms';
import Arguments from './arguments';

const transactionButtonClass = 'component-btn-transaction';

const ArgumentsAndRunner = (props) => {
  const args = props.args;
  const gasConsumable = props.gasConsumable;
  const payable = props.payable;
  const feeDelegatable = props.feeDelegatable;
  const argsRef = React.createRef();

  const runnerName = props.runnerName;
  const runnerClass = gasConsumable ? transactionButtonClass : "";
  const runner = props.runner;
  return (
    <CardRow>
      <CardItem ratio={1} hideOverflow>
        <Arguments
          args={args}
          gasConsumable={gasConsumable}
          payable={payable}
          feeDelegatable={feeDelegatable}
          ref={argsRef} />
      </CardItem>
      <CardItem ratio={0}>
        <Button
          name={runnerName}
          class={runnerClass}
          onClick={() => runner(argsRef)}
        />
      </CardItem>
    </CardRow>
  );
}

ArgumentsAndRunner.propTypes = {
  args: PropTypes.array,
  gasConsumable: PropTypes.bool,
  payable: PropTypes.bool,
  feeDelegatable: PropTypes.bool,
  runnerName: PropTypes.string,
  runner: PropTypes.func
}

export default ArgumentsAndRunner;
