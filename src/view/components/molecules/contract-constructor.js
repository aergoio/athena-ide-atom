import React from 'react'
import PropTypes from 'prop-types';
import { CardRow, Description, InputBox } from '../atoms';

const ContractConstructor = (props) => {
  const args = props.args;
  const argsRef = props.argsRef;
  const inputPlaceHolder = args.length === 0 ? "No argument" : args.join(", ");
  return (
    <CardRow>
      <Description
        description="Args"
      />
      <InputBox type='text'
        ref={argsRef}
        placeHolder={inputPlaceHolder}
      />
    </CardRow>
  );
}

ContractConstructor.propTypes = {
  args: PropTypes.array,
  argsRef: PropTypes.any
}

export default ContractConstructor;
