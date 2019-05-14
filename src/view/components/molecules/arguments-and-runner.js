import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Button } from '../atoms';
import Arguments from './arguments';

const ArgumentsAndRunner = (props) => {
  const args = props.args;
  const payable = props.payable;
  const runnerName = props.runnerName;
  const runnerStyle = props.runnerStyle;
  const runner = props.runner;

  const argsRef = React.createRef();
  return (
    <CardRow class='card-row-argument'>
      <Arguments args={args} payable={payable} ref={argsRef} />
      <Button
        name={runnerName}
        class={runnerStyle}
        onClick={() => runner(argsRef)}
      />
    </CardRow>
  );
}

ArgumentsAndRunner.propTypes = {
  args: PropTypes.array,
  payable: PropTypes.bool,
  runnerName: PropTypes.string,
  runnerStyle: PropTypes.string,
  runner: PropTypes.func
}

export default ArgumentsAndRunner;
