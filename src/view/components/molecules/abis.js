'use babel';

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Button, InputBox } from '../atoms';

const Abis = (props) => {
  const abiFunctions = props.abi.functions;
  const onAbiCall = props.onAbiCall;

  if (typeof abiFunctions === "undefined") {
    return <div></div>;
  }
  return abiFunctions.filter(f => "constructor" !== f.name)
    .map((abiFunction, index) => {
      const argsRef = React.createRef();
      const args = abiFunction.arguments;
      const inputPlaceHolder = args.length === 0 ? "No argument" : args.map(a => a.name).join(", ");
      return (
        <Row key={index} >
          <Button
            name={abiFunction.name}
            class={['component-btn-runner', 'component-description', 'btn-warning']}
            onClick={() => onAbiCall(argsRef, abiFunction.name)}
          />
          <InputBox type='text' class='component-inputbox-text'
            inputRef={argsRef}
            placeHolder={inputPlaceHolder}
          />
        </Row>
      );
    }
  );
}

Abis.propTypes = {
  abi: PropTypes.object,
  trigger: PropTypes.element,
  onClick: PropTypes.func
}

export default Abis;