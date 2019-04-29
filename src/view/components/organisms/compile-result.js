import React from 'react'
import PropTypes from 'prop-types';

import { ComponentsHolder, Row, Title } from '../atoms';
import { Payload, Abi } from '../molecules';

export const CompileResult = (props) => {
  const payload = props.payload;
  const abi = props.abi;
  return (
    <ComponentsHolder>
      <Row>
        <Title title='Contract Info'/>
      </Row>
      <Payload payload={payload} />
      <Abi abi={abi} />
    </ComponentsHolder>
  );
}

CompileResult.propTypes = {
  payload: PropTypes.string,
  abi: PropTypes.string
}

export default CompileResult;