import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, CardItem, Description } from '../atoms';
import Arguments from './arguments';

const ConstructorArguments = (props) => {
  const args = props.args;
  const payable = props.payable;
  const argsRef = props.argsRef;
  return (
    <CardRow>
      <CardItem ratio={0}>
        <Description description="Args" />
      </CardItem>
      <CardItem ratio={1} hideOverflow>
        <Arguments args={args} gasConsumable payable={payable} ref={argsRef} />
      </CardItem>
    </CardRow>
  );
}

ConstructorArguments.propTypes = {
  args: PropTypes.array,
  payable: PropTypes.bool,
  argsRef: PropTypes.any
}

export default ConstructorArguments;
