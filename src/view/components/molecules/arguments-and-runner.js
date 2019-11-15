import React from 'react'
import PropTypes from 'prop-types';
import { Flex, Box } from 'reflexbox';
import { CardRow, Button, CheckBox } from '../atoms';
import Arguments from './arguments';

const ArgumentsAndRunner = (props) => {
  const args = props.args;
  const payable = props.payable;
  const feeDelegation = props.feeDelegation;
  const runnerName = props.runnerName;
  const runnerStyle = props.runnerStyle;
  const runner = props.runner;

  const argsRef = React.createRef();
  const delegateFeeRef = React.createRef();

  let delegateFeeBoxOrNot;
  if (true === feeDelegation) {
    delegateFeeBoxOrNot = (
      <Box>
        <CheckBox text="Delegate fee" ref={delegateFeeRef} />
      </Box>
    );
  } else {
    delegateFeeBoxOrNot = <div></div>;
  }
  return (
    <CardRow style={{ flexDirection: 'column' }}>
      <Box>
        <Arguments args={args} payable={payable} ref={argsRef} />
      </Box>
      <Box style={{ paddingTop: '5px' }}>
        <Flex align='right' justify='space-between'>
          {delegateFeeBoxOrNot}
          <Box>
            <Button
              name={runnerName}
              class={runnerStyle}
              onClick={() => runner(argsRef, delegateFeeRef)}
            />
          </Box>
        </Flex>
      </Box>
    </CardRow>
  );
}

ArgumentsAndRunner.propTypes = {
  args: PropTypes.array,
  payable: PropTypes.bool,
  feeDelegation: PropTypes.bool,
  runnerName: PropTypes.string,
  runnerStyle: PropTypes.string,
  runner: PropTypes.func
}

export default ArgumentsAndRunner;
